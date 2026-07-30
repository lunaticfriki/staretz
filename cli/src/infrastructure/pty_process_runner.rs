use std::io::{Read, Write};
use std::path::Path;
use std::sync::mpsc::{self, Receiver, Sender};
use std::thread;

use portable_pty::{native_pty_system, Child, CommandBuilder, MasterPty, PtySize as NativePtySize};

use crate::domain::ports::process_runner::ProcessError;
use crate::domain::ports::pty_runner::{PtyHandle, PtyRunner};
use crate::domain::value_objects::pty_size::PtySize;
use crate::domain::value_objects::shell_command::ShellCommand;
use crate::domain::value_objects::terminal_snapshot::{TerminalCell, TerminalColor, TerminalSnapshot};

/// No scrollback is kept beyond the visible screen — a `TerminalSnapshot`
/// only ever shows the current screen, matching how a full-screen program
/// like `claude` redraws itself rather than scrolling a log.
const SCROLLBACK_LINES: usize = 0;

/// Adapter for the `PtyRunner`/`PtyHandle` ports, backed by `portable-pty`
/// (a real pseudo-terminal, so full-screen programs render correctly) plus
/// a `vt100` terminal emulator that turns the raw output stream into a
/// `TerminalSnapshot` presentation can draw without knowing about either
/// crate.
pub struct PtyProcessRunner;

impl PtyProcessRunner {
    pub fn new() -> Self {
        PtyProcessRunner
    }
}

impl Default for PtyProcessRunner {
    fn default() -> Self {
        Self::new()
    }
}

impl PtyRunner for PtyProcessRunner {
    fn start(&self, command: &ShellCommand, cwd: &Path, size: PtySize) -> Result<Box<dyn PtyHandle>, ProcessError> {
        let pty_system = native_pty_system();
        let pair = pty_system
            .openpty(to_native_size(size))
            .map_err(|err| ProcessError::new(err.to_string()))?;

        let mut cmd = CommandBuilder::new("sh");
        cmd.arg("-c");
        cmd.arg(command.as_str());
        cmd.cwd(cwd);

        let child = pair
            .slave
            .spawn_command(cmd)
            .map_err(|err| ProcessError::new(err.to_string()))?;
        // Our copy of the slave fd must be closed so the master's reader
        // sees EOF once the child (and anything it spawned) exits.
        drop(pair.slave);

        let reader = pair
            .master
            .try_clone_reader()
            .map_err(|err| ProcessError::new(err.to_string()))?;
        let writer = pair
            .master
            .take_writer()
            .map_err(|err| ProcessError::new(err.to_string()))?;

        let (tx, rx) = mpsc::channel();
        thread::spawn(move || pump(reader, tx));

        Ok(Box::new(PortablePtyHandle {
            child,
            master: pair.master,
            writer,
            rx,
            parser: vt100::Parser::new(size.rows(), size.cols(), SCROLLBACK_LINES),
        }))
    }
}

struct PortablePtyHandle {
    child: Box<dyn Child + Send + Sync>,
    master: Box<dyn MasterPty + Send>,
    writer: Box<dyn Write + Send>,
    rx: Receiver<Vec<u8>>,
    parser: vt100::Parser,
}

impl PtyHandle for PortablePtyHandle {
    fn write_input(&mut self, bytes: &[u8]) -> Result<(), ProcessError> {
        self.writer
            .write_all(bytes)
            .and_then(|()| self.writer.flush())
            .map_err(|err| ProcessError::new(err.to_string()))
    }

    fn resize(&mut self, size: PtySize) {
        let _ = self.master.resize(to_native_size(size));
        self.parser.set_size(size.rows(), size.cols());
    }

    fn snapshot(&mut self) -> TerminalSnapshot {
        for chunk in self.rx.try_iter() {
            self.parser.process(&chunk);
        }
        snapshot_from_screen(self.parser.screen())
    }

    fn try_wait(&mut self) -> Option<i32> {
        match self.child.try_wait() {
            Ok(Some(status)) => Some(status.exit_code() as i32),
            _ => None,
        }
    }

    fn kill(&mut self) {
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

fn to_native_size(size: PtySize) -> NativePtySize {
    NativePtySize {
        rows: size.rows(),
        cols: size.cols(),
        pixel_width: 0,
        pixel_height: 0,
    }
}

fn pump<R: Read>(mut reader: R, tx: Sender<Vec<u8>>) {
    let mut buf = [0u8; 4096];
    loop {
        match reader.read(&mut buf) {
            Ok(0) => return,
            Ok(n) => {
                if tx.send(buf[..n].to_vec()).is_err() {
                    return;
                }
            }
            Err(_) => return,
        }
    }
}

fn snapshot_from_screen(screen: &vt100::Screen) -> TerminalSnapshot {
    let (rows, cols) = screen.size();
    let mut grid = Vec::with_capacity(rows as usize);
    for row in 0..rows {
        let mut line = Vec::with_capacity(cols as usize);
        for col in 0..cols {
            let cell = match screen.cell(row, col) {
                Some(cell) => TerminalCell {
                    ch: cell.contents().chars().next().unwrap_or(' '),
                    fg: map_color(cell.fgcolor()),
                    bg: map_color(cell.bgcolor()),
                    bold: cell.bold(),
                    italic: cell.italic(),
                    underline: cell.underline(),
                    inverse: cell.inverse(),
                },
                None => TerminalCell::blank(),
            };
            line.push(cell);
        }
        grid.push(line);
    }

    let (cursor_row, cursor_col) = screen.cursor_position();
    TerminalSnapshot::new(grid, cursor_row, cursor_col, !screen.hide_cursor())
}

fn map_color(color: vt100::Color) -> TerminalColor {
    match color {
        vt100::Color::Default => TerminalColor::Default,
        vt100::Color::Idx(idx) => TerminalColor::Indexed(idx),
        vt100::Color::Rgb(r, g, b) => TerminalColor::Rgb(r, g, b),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    use std::time::{Duration, Instant};

    fn wait_for<F: FnMut() -> bool>(mut condition: F) {
        let deadline = Instant::now() + Duration::from_secs(5);
        while Instant::now() < deadline && !condition() {
            thread::sleep(Duration::from_millis(20));
        }
    }

    #[test]
    fn renders_output_from_the_child_into_a_snapshot() {
        let runner = PtyProcessRunner::new();
        let command = ShellCommand::create("printf hello-from-pty").unwrap();
        let mut handle = runner.start(&command, &PathBuf::from("."), PtySize::new(24, 80)).unwrap();

        let mut found = false;
        wait_for(|| {
            let snapshot = handle.snapshot();
            found = snapshot
                .rows()
                .iter()
                .any(|row| row.iter().map(|cell| cell.ch).collect::<String>().contains("hello-from-pty"));
            found
        });

        assert!(found, "expected the pty's output to contain the printed text");
    }

    #[test]
    fn reports_exit_status() {
        let runner = PtyProcessRunner::new();
        let command = ShellCommand::create("exit 0").unwrap();
        let mut handle = runner.start(&command, &PathBuf::from("."), PtySize::new(24, 80)).unwrap();

        let mut code = None;
        wait_for(|| {
            code = handle.try_wait();
            code.is_some()
        });

        assert_eq!(code, Some(0));
    }

    #[test]
    fn kill_terminates_the_process() {
        let runner = PtyProcessRunner::new();
        let command = ShellCommand::create("sleep 30").unwrap();
        let mut handle = runner.start(&command, &PathBuf::from("."), PtySize::new(24, 80)).unwrap();

        assert!(handle.try_wait().is_none());
        handle.kill();
        assert!(handle.try_wait().is_some());
    }
}
