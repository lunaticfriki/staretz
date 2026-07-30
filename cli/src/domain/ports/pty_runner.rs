use std::path::Path;

use crate::domain::value_objects::pty_size::PtySize;
use crate::domain::value_objects::shell_command::ShellCommand;
use crate::domain::value_objects::terminal_snapshot::TerminalSnapshot;

use super::process_runner::ProcessError;

/// Port: the capability to run an external command attached to a
/// pseudo-terminal, so a program that needs a real terminal (e.g.
/// `claude`) can be rendered inside a pane of our own TUI instead of
/// taking over the whole screen. Infrastructure decides how — today, a
/// pty plus a terminal emulator that turns raw output into a
/// `TerminalSnapshot`.
pub trait PtyRunner {
    fn start(&self, command: &ShellCommand, cwd: &Path, size: PtySize) -> Result<Box<dyn PtyHandle>, ProcessError>;
}

/// Handle to a program started via `PtyRunner::start`.
pub trait PtyHandle {
    /// Forwards raw input bytes (already translated from a key event) to
    /// the program, as if typed at a real terminal.
    fn write_input(&mut self, bytes: &[u8]) -> Result<(), ProcessError>;

    /// Tells the program its pane changed size.
    fn resize(&mut self, size: PtySize);

    /// Feeds any newly-arrived output through the terminal emulator and
    /// returns the resulting screen. This is the terminal-emulation
    /// equivalent of `RunningHandle::drain_output`, except the result is
    /// the current full screen rather than an appended log — that's what a
    /// real terminal pane shows.
    fn snapshot(&mut self) -> TerminalSnapshot;

    /// Non-blocking check for whether the process has exited.
    fn try_wait(&mut self) -> Option<i32>;

    /// Forcibly terminates the process (and anything it spawned).
    fn kill(&mut self);
}
