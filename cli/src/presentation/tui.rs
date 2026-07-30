use std::io::{self, Stdout};
use std::time::Duration;

use crossterm::event::{self, Event, KeyCode, KeyEvent, KeyEventKind, KeyModifiers};
use crossterm::execute;
use crossterm::terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen};
use ratatui::backend::CrosstermBackend;
use ratatui::layout::{Constraint, Direction, Layout, Margin};
use ratatui::style::{Color, Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::{Block, Borders, Paragraph, Tabs, Wrap};
use ratatui::Terminal;

use crate::application::menu_app_service::MenuAppService;
use crate::domain::value_objects::pty_size::PtySize;
use crate::domain::value_objects::terminal_snapshot::{TerminalCell, TerminalColor, TerminalSnapshot};

const TICK: Duration = Duration::from_millis(80);

/// Leaves a focused pty pane and returns to tab navigation, without
/// stopping the program running inside it.
const DETACH_KEY: char = 'o';

/// Which widget currently owns keystrokes: the tab bar (navigation keys
/// like `q`/`Tab`/`k` do their usual thing) or a focused pty pane (every
/// key is forwarded to the program running inside it, except the detach
/// key). Presentation-only state — this is why it lives here rather than
/// on the `TabReadModel` the application layer hands back.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Focus {
    TabBar,
    Pty,
}

struct App {
    service: MenuAppService,
    scroll: Vec<u16>,
    status: &'static str,
    focus: Focus,
}

impl App {
    fn new(service: MenuAppService) -> Self {
        let tab_count = service.tabs().len();
        App {
            service,
            scroll: vec![0; tab_count],
            status: "Enter: run/focus  Ctrl+o: back to tabs  k: stop  Tab/\u{2190}\u{2192}: switch  q: quit",
            focus: Focus::TabBar,
        }
    }
}

pub fn run(service: MenuAppService) -> anyhow::Result<()> {
    let mut app = App::new(service);
    let mut terminal = setup_terminal()?;
    let result = event_loop(&mut terminal, &mut app);

    app.service.stop_all();
    restore_terminal(&mut terminal)?;
    result
}

fn setup_terminal() -> anyhow::Result<Terminal<CrosstermBackend<Stdout>>> {
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    Ok(Terminal::new(CrosstermBackend::new(stdout))?)
}

fn restore_terminal(terminal: &mut Terminal<CrosstermBackend<Stdout>>) -> anyhow::Result<()> {
    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
    terminal.show_cursor()?;
    Ok(())
}

fn event_loop(terminal: &mut Terminal<CrosstermBackend<Stdout>>, app: &mut App) -> anyhow::Result<()> {
    loop {
        app.service.sync();
        if app.focus == Focus::Pty && !app.service.selected().is_running {
            app.focus = Focus::TabBar;
        }
        terminal.draw(|f| draw(f, app))?;

        if !event::poll(TICK)? {
            continue;
        }
        match event::read()? {
            Event::Key(key) => {
                if key.kind != KeyEventKind::Press {
                    continue;
                }
                if !handle_key(app, key) {
                    break;
                }
            }
            Event::Resize(cols, rows) if app.service.selected_is_interactive() => {
                app.service.resize_selected_pty(pty_size_for_terminal(cols, rows));
            }
            _ => {}
        }
    }
    Ok(())
}

/// Returns `false` when the app should quit.
fn handle_key(app: &mut App, key: KeyEvent) -> bool {
    if app.focus == Focus::Pty {
        let is_detach = key.modifiers.contains(KeyModifiers::CONTROL)
            && matches!(key.code, KeyCode::Char(c) if c == DETACH_KEY);
        if is_detach {
            app.focus = Focus::TabBar;
        } else if let Some(bytes) = key_event_to_pty_bytes(key) {
            app.service.write_to_selected_pty(bytes);
        }
        return true;
    }

    let selected = app.service.selected_index();
    match key.code {
        KeyCode::Char('q') => return false,
        KeyCode::Char('c') if key.modifiers.contains(KeyModifiers::CONTROL) => return false,
        KeyCode::Tab | KeyCode::Right | KeyCode::Char('l') => app.service.select_next(),
        KeyCode::BackTab | KeyCode::Left | KeyCode::Char('h') => app.service.select_previous(),
        KeyCode::Down | KeyCode::Char('j') => {
            app.scroll[selected] = app.scroll[selected].saturating_add(1);
        }
        KeyCode::Up | KeyCode::Char('K') => {
            app.scroll[selected] = app.scroll[selected].saturating_sub(1);
        }
        KeyCode::Char('k') => {
            let _ = app.service.stop_selected();
        }
        KeyCode::Enter => {
            if app.service.selected_is_interactive() {
                let _ = app.service.start_selected_pty(current_pty_size());
                app.focus = Focus::Pty;
            } else {
                let _ = app.service.start_selected();
            }
        }
        _ => {}
    }
    true
}

/// Translates a key event into the raw bytes a real terminal would have
/// sent, for forwarding into a focused pty. `None` for keys with no
/// sensible terminal encoding (e.g. a bare modifier key).
fn key_event_to_pty_bytes(key: KeyEvent) -> Option<Vec<u8>> {
    use KeyCode::*;

    if key.modifiers.contains(KeyModifiers::CONTROL) && let Char(c) = key.code {
        let c = c.to_ascii_lowercase();
        if c.is_ascii_lowercase() {
            return Some(vec![(c as u8) & 0x1f]);
        }
    }

    match key.code {
        Char(c) => {
            let mut buf = [0u8; 4];
            Some(c.encode_utf8(&mut buf).as_bytes().to_vec())
        }
        Enter if key.modifiers.contains(KeyModifiers::SHIFT) => Some(b"\n".to_vec()),
        Enter => Some(b"\r".to_vec()),
        Backspace => Some(vec![0x7f]),
        Tab => Some(b"\t".to_vec()),
        BackTab => Some(b"\x1b[Z".to_vec()),
        Esc => Some(vec![0x1b]),
        Up => Some(b"\x1b[A".to_vec()),
        Down => Some(b"\x1b[B".to_vec()),
        Right => Some(b"\x1b[C".to_vec()),
        Left => Some(b"\x1b[D".to_vec()),
        Home => Some(b"\x1b[H".to_vec()),
        End => Some(b"\x1b[F".to_vec()),
        PageUp => Some(b"\x1b[5~".to_vec()),
        PageDown => Some(b"\x1b[6~".to_vec()),
        Delete => Some(b"\x1b[3~".to_vec()),
        Insert => Some(b"\x1b[2~".to_vec()),
        _ => None,
    }
}

fn current_pty_size() -> PtySize {
    let (cols, rows) = crossterm::terminal::size().unwrap_or((80, 24));
    pty_size_for_terminal(cols, rows)
}

/// The pty pane is the body chunk (see `draw`'s layout: header height 3 +
/// status height 1) minus its own border on every side.
fn pty_size_for_terminal(cols: u16, rows: u16) -> PtySize {
    PtySize::new(rows.saturating_sub(6), cols.saturating_sub(2))
}

fn draw(f: &mut ratatui::Frame, app: &App) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Length(3), Constraint::Min(0), Constraint::Length(1)])
        .split(f.area());

    let tabs = app.service.tabs();
    let selected_index = app.service.selected_index();
    let selected_tab = app.service.selected();

    let titles: Vec<Line> = tabs
        .iter()
        .map(|tab| {
            let marker = if tab.is_running { "\u{25cf} " } else { "  " };
            Line::from(format!("{marker}{}", tab.name))
        })
        .collect();

    let tabs_widget = Tabs::new(titles)
        .select(selected_index)
        .block(Block::default().borders(Borders::ALL).title("staretz-cli"))
        .highlight_style(
            Style::default()
                .fg(Color::Black)
                .bg(Color::Cyan)
                .add_modifier(Modifier::BOLD),
        );
    f.render_widget(tabs_widget, chunks[0]);

    let body_block = Block::default().borders(Borders::ALL).title(selected_tab.command.as_str());

    if selected_tab.interactive {
        if let Some(snapshot) = &selected_tab.pty_snapshot {
            let paragraph = Paragraph::new(pty_lines(snapshot)).block(body_block);
            f.render_widget(paragraph, chunks[1]);

            if app.focus == Focus::Pty && snapshot.cursor_visible() {
                let inner = chunks[1].inner(Margin { horizontal: 1, vertical: 1 });
                if inner.width > 0 && inner.height > 0 {
                    let (cursor_row, cursor_col) = snapshot.cursor();
                    let x = inner.x + cursor_col.min(inner.width - 1);
                    let y = inner.y + cursor_row.min(inner.height - 1);
                    f.set_cursor_position((x, y));
                }
            }
        } else {
            let paragraph = Paragraph::new(format!(
                "\"{}\" is an interactive program.\nPress Enter to run it, embedded in this pane.",
                selected_tab.command,
            ))
            .wrap(Wrap { trim: false })
            .block(body_block);
            f.render_widget(paragraph, chunks[1]);
        }
    } else {
        let paragraph = Paragraph::new(selected_tab.output_lines.join("\n"))
            .wrap(Wrap { trim: false })
            .scroll((app.scroll[selected_index], 0))
            .block(body_block);
        f.render_widget(paragraph, chunks[1]);
    }

    let status_text = if app.focus == Focus::Pty {
        "Ctrl+o: back to tabs (keys go to the program)"
    } else {
        app.status
    };
    let status = Paragraph::new(status_text).style(Style::default().fg(Color::DarkGray));
    f.render_widget(status, chunks[2]);
}

fn pty_lines(snapshot: &TerminalSnapshot) -> Vec<Line<'static>> {
    snapshot
        .rows()
        .iter()
        .map(|row| {
            let spans: Vec<Span<'static>> =
                row.iter().map(|cell| Span::styled(cell.ch.to_string(), cell_style(cell))).collect();
            Line::from(spans)
        })
        .collect()
}

fn cell_style(cell: &TerminalCell) -> Style {
    let mut style = Style::default();
    style = match cell.fg {
        TerminalColor::Default => style,
        TerminalColor::Indexed(idx) => style.fg(Color::Indexed(idx)),
        TerminalColor::Rgb(r, g, b) => style.fg(Color::Rgb(r, g, b)),
    };
    style = match cell.bg {
        TerminalColor::Default => style,
        TerminalColor::Indexed(idx) => style.bg(Color::Indexed(idx)),
        TerminalColor::Rgb(r, g, b) => style.bg(Color::Rgb(r, g, b)),
    };
    if cell.bold {
        style = style.add_modifier(Modifier::BOLD);
    }
    if cell.italic {
        style = style.add_modifier(Modifier::ITALIC);
    }
    if cell.underline {
        style = style.add_modifier(Modifier::UNDERLINED);
    }
    if cell.inverse {
        style = style.add_modifier(Modifier::REVERSED);
    }
    style
}
