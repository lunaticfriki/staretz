use std::path::Path;

use crate::domain::value_objects::shell_command::ShellCommand;

/// Port: the capability to run an external command as a background job
/// whose output can be observed and stopped. Infrastructure decides how (a
/// shell, a container, ...) — today, `sh -c` plus piped stdio. A program
/// that needs a real terminal to run (e.g. `claude`) goes through the
/// separate `PtyRunner` port instead — that's a genuinely different
/// capability (bidirectional, terminal-emulated), not a variant of this
/// one.
pub trait ProcessRunner {
    fn start(&self, command: &ShellCommand, cwd: &Path) -> Result<Box<dyn RunningHandle>, ProcessError>;
}

/// Handle to a background job started via `ProcessRunner::start`.
pub trait RunningHandle {
    /// Returns every output line received since the last call.
    fn drain_output(&mut self) -> Vec<String>;

    /// Non-blocking check for whether the process has exited.
    fn try_wait(&mut self) -> Option<i32>;

    /// Forcibly terminates the process (and anything it spawned).
    fn kill(&mut self);
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
#[error("process error: {0}")]
pub struct ProcessError(String);

impl ProcessError {
    pub fn new(message: impl Into<String>) -> Self {
        ProcessError(message.into())
    }
}
