use pulldown_cmark::{Event, HeadingLevel, Options, Parser, Tag, TagEnd};
use ratatui::style::{Color, Modifier, Style};
use ratatui::text::{Line, Span};

/// Renders raw markdown into styled `ratatui` lines. `DocsRepository` only
/// ever hands back a raw `String` (see `docs_repository.rs`), so parsing
/// and styling both live here — the same precedent as `tui.rs`'s
/// `pty_lines`/`cell_style` turning an external representation into
/// `ratatui` spans in presentation rather than domain.
///
/// Simplification, deliberately: list/blockquote markers repeat on every
/// wrapped line of a block rather than only the first (most terminal
/// markdown viewers do this for blockquotes already; here it also applies
/// to list markers for implementation simplicity). For the mostly
/// single-line bullets in this project's docs it's visually
/// indistinguishable from "correct" rendering.
pub fn render(markdown: &str) -> Vec<Line<'static>> {
    let mut renderer = Renderer::default();
    for event in Parser::new_ext(markdown, Options::ENABLE_TABLES) {
        renderer.handle(event);
    }
    renderer.finish()
}

enum ListKind {
    Bullet,
    Ordered(u64),
}

#[derive(Default)]
struct TableState {
    header: Vec<String>,
    rows: Vec<Vec<String>>,
    current_row: Vec<String>,
    current_cell: String,
}

#[derive(Default)]
struct Renderer {
    lines: Vec<Line<'static>>,
    current: Vec<Span<'static>>,
    style_stack: Vec<Style>,
    lists: Vec<ListKind>,
    prefix_stack: Vec<String>,
    in_code_block: bool,
    code_buffer: Option<String>,
    table: Option<TableState>,
}

impl Renderer {
    fn handle(&mut self, event: Event) {
        match event {
            Event::Start(tag) => self.start(tag),
            Event::End(tag) => self.end(tag),
            Event::Text(text) => self.push_text(text.into_string()),
            Event::Code(text) => self.push_styled_text(text.into_string(), code_style()),
            Event::SoftBreak => self.push_text(" ".to_string()),
            Event::HardBreak => self.flush_line(),
            Event::Rule => {
                self.flush_line();
                self.lines.push(Line::from(Span::styled(
                    "\u{2500}".repeat(60),
                    Style::default().fg(Color::DarkGray),
                )));
                self.push_blank();
            }
            Event::TaskListMarker(checked) => {
                let marker = if checked { "[x] " } else { "[ ] " };
                self.push_text(marker.to_string());
            }
            _ => {}
        }
    }

    fn start(&mut self, tag: Tag) {
        match tag {
            Tag::Heading { level, .. } => {
                self.style_stack.push(heading_style());
                let marker = "#".repeat(heading_number(level));
                self.current.push(Span::styled(format!("{marker} "), heading_style()));
            }
            Tag::Emphasis => self.push_style(current_style_of(&self.style_stack).add_modifier(Modifier::ITALIC)),
            Tag::Strong => self.push_style(current_style_of(&self.style_stack).add_modifier(Modifier::BOLD)),
            Tag::Strikethrough => {
                self.push_style(current_style_of(&self.style_stack).add_modifier(Modifier::CROSSED_OUT))
            }
            Tag::Link { .. } => self.push_style(
                current_style_of(&self.style_stack)
                    .fg(Color::Blue)
                    .add_modifier(Modifier::UNDERLINED),
            ),
            Tag::BlockQuote(_) => self.prefix_stack.push("\u{2503} ".to_string()),
            Tag::List(start) => self.lists.push(match start {
                Some(n) => ListKind::Ordered(n),
                None => ListKind::Bullet,
            }),
            Tag::Item => {
                let marker = match self.lists.last_mut() {
                    Some(ListKind::Bullet) => "- ".to_string(),
                    Some(ListKind::Ordered(n)) => {
                        let marker = format!("{n}. ");
                        *n += 1;
                        marker
                    }
                    None => "- ".to_string(),
                };
                self.prefix_stack.push(marker);
            }
            Tag::CodeBlock(_) => {
                self.flush_line();
                self.in_code_block = true;
            }
            Tag::Table(_) => self.table = Some(TableState::default()),
            Tag::TableHead | Tag::TableRow => {
                if let Some(table) = &mut self.table {
                    table.current_row.clear();
                }
            }
            Tag::TableCell => {
                if let Some(table) = &mut self.table {
                    table.current_cell.clear();
                }
            }
            _ => {}
        }
    }

    fn end(&mut self, tag: TagEnd) {
        match tag {
            TagEnd::Heading(_) => {
                self.style_stack.pop();
                self.flush_line();
                self.push_blank();
            }
            TagEnd::Emphasis | TagEnd::Strong | TagEnd::Strikethrough | TagEnd::Link => {
                self.style_stack.pop();
            }
            TagEnd::BlockQuote(_) => {
                self.prefix_stack.pop();
                self.push_blank();
            }
            TagEnd::List(_) => {
                self.lists.pop();
                self.push_blank();
            }
            TagEnd::Item => {
                self.flush_line();
                self.prefix_stack.pop();
            }
            TagEnd::CodeBlock => {
                if let Some(remainder) = self.code_buffer.take()
                    && !remainder.is_empty()
                {
                    self.lines.push(Line::from(Span::styled(remainder, code_style())));
                }
                self.in_code_block = false;
                self.push_blank();
            }
            TagEnd::Paragraph => {
                self.flush_line();
                if self.lists.is_empty() {
                    self.push_blank();
                }
            }
            TagEnd::Table => self.finish_table(),
            TagEnd::TableHead => {
                if let Some(table) = &mut self.table {
                    table.header = std::mem::take(&mut table.current_row);
                }
            }
            TagEnd::TableRow => {
                if let Some(table) = &mut self.table {
                    let row = std::mem::take(&mut table.current_row);
                    table.rows.push(row);
                }
            }
            TagEnd::TableCell => {
                if let Some(table) = &mut self.table {
                    let cell = std::mem::take(&mut table.current_cell);
                    table.current_row.push(cell);
                }
            }
            _ => {}
        }
    }

    fn push_text(&mut self, text: String) {
        let style = current_style_of(&self.style_stack);
        self.push_styled_text(text, style);
    }

    fn push_styled_text(&mut self, text: String, style: Style) {
        if self.in_code_block {
            let combined = format!("{}{text}", self.code_buffer.take().unwrap_or_default());
            let mut parts: Vec<&str> = combined.split('\n').collect();
            let remainder = parts.pop().unwrap_or_default().to_string();
            for part in parts {
                self.lines.push(Line::from(Span::styled(part.to_string(), code_style())));
            }
            self.code_buffer = Some(remainder);
        } else if let Some(table) = &mut self.table {
            table.current_cell.push_str(&text);
        } else {
            self.current.push(Span::styled(text, style));
        }
    }

    fn push_style(&mut self, style: Style) {
        self.style_stack.push(style);
    }

    fn flush_line(&mut self) {
        if self.current.is_empty() && self.prefix_stack.is_empty() {
            return;
        }
        let mut spans = Vec::new();
        let prefix = self.prefix_stack.concat();
        if !prefix.is_empty() {
            spans.push(Span::styled(prefix, Style::default().fg(Color::DarkGray)));
        }
        spans.extend(std::mem::take(&mut self.current));
        self.lines.push(Line::from(spans));
    }

    fn push_blank(&mut self) {
        if !matches!(self.lines.last(), Some(line) if line.spans.is_empty()) {
            self.lines.push(Line::from(""));
        }
    }

    fn finish_table(&mut self) {
        let Some(table) = self.table.take() else { return };
        if table.header.is_empty() && table.rows.is_empty() {
            return;
        }

        let column_count = table
            .header
            .len()
            .max(table.rows.iter().map(Vec::len).max().unwrap_or(0));
        let mut widths = vec![0usize; column_count];
        for (i, cell) in table.header.iter().enumerate() {
            widths[i] = widths[i].max(cell.len());
        }
        for row in &table.rows {
            for (i, cell) in row.iter().enumerate() {
                widths[i] = widths[i].max(cell.len());
            }
        }

        if !table.header.is_empty() {
            self.lines
                .push(padded_row(&table.header, &widths, Style::default().add_modifier(Modifier::BOLD)));
            let separator: Vec<String> = widths.iter().map(|w| "-".repeat(*w)).collect();
            self.lines.push(padded_row(&separator, &widths, Style::default().fg(Color::DarkGray)));
        }
        for row in &table.rows {
            self.lines.push(padded_row(row, &widths, Style::default()));
        }
        self.push_blank();
    }

    fn finish(mut self) -> Vec<Line<'static>> {
        self.flush_line();
        while matches!(self.lines.last(), Some(line) if line.spans.is_empty()) {
            self.lines.pop();
        }
        self.lines
    }
}

fn padded_row(cells: &[String], widths: &[usize], style: Style) -> Line<'static> {
    let text = cells
        .iter()
        .enumerate()
        .map(|(i, cell)| format!("{:width$}", cell, width = widths.get(i).copied().unwrap_or(cell.len())))
        .collect::<Vec<_>>()
        .join(" | ");
    Line::from(Span::styled(text, style))
}

fn current_style_of(stack: &[Style]) -> Style {
    stack.last().copied().unwrap_or_default()
}

fn heading_style() -> Style {
    Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD)
}

fn code_style() -> Style {
    Style::default().fg(Color::Yellow)
}

fn heading_number(level: HeadingLevel) -> usize {
    match level {
        HeadingLevel::H1 => 1,
        HeadingLevel::H2 => 2,
        HeadingLevel::H3 => 3,
        HeadingLevel::H4 => 4,
        HeadingLevel::H5 => 5,
        HeadingLevel::H6 => 6,
    }
}
