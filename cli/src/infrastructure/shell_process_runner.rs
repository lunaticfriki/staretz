use std::io::{BufRead, BufReader};
use std::path::Path;
use std::process::{Child, Command, Stdio};
use std::sync::mpsc::{self, Receiver, Sender};
use std::thread;

#[cfg(unix)]
use std::os::unix::process::CommandExt;

use crate::domain::ports::process_runner::{ProcessError, ProcessRunner, RunningHandle};
use crate::domain::value_objects::shell_command::ShellCommand;

/// Adapter for the `ProcessRunner`/`RunningHandle` ports, backed by `sh -c`
/// plus piped stdio for background jobs, and inherited stdio for
/// interactive ones.
pub struct ShellProcessRunner;

impl ShellProcessRunner {
    pub fn new() -> Self {
        ShellProcessRunner
    }
}

impl Default for ShellProcessRunner {
    fn default() -> Self {
        Self::new()
    }
}

impl ProcessRunner for ShellProcessRunner {
    fn start(&self, command: &ShellCommand, cwd: &Path) -> Result<Box<dyn RunningHandle>, ProcessError> {
        let (tx, rx) = mpsc::channel();

        let mut cmd = Command::new("sh");
        cmd.arg("-c")
            .arg(command.as_str())
            .current_dir(cwd)
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());
        // Put the child in its own process group so `kill` below can take
        // out the whole tree (e.g. `pnpm dev` -> `vite`), not just the shell.
        #[cfg(unix)]
        cmd.process_group(0);

        let mut child = cmd.spawn().map_err(|err| ProcessError::new(err.to_string()))?;

        if let Some(stdout) = child.stdout.take() {
            let tx = tx.clone();
            thread::spawn(move || pump(BufReader::new(stdout), tx));
        }
        if let Some(stderr) = child.stderr.take() {
            thread::spawn(move || pump(BufReader::new(stderr), tx));
        }

        Ok(Box::new(ShellRunningHandle { child, rx }))
    }
}

struct ShellRunningHandle {
    child: Child,
    rx: Receiver<String>,
}

impl RunningHandle for ShellRunningHandle {
    fn drain_output(&mut self) -> Vec<String> {
        self.rx.try_iter().collect()
    }

    fn try_wait(&mut self) -> Option<i32> {
        match self.child.try_wait() {
            Ok(Some(status)) => Some(status.code().unwrap_or(-1)),
            _ => None,
        }
    }

    fn kill(&mut self) {
        #[cfg(unix)]
        {
            // Negative pid targets the whole process group created via
            // process_group(0) above, so grandchildren die too.
            let pid = self.child.id() as i32;
            let _ = Command::new("kill").arg("-KILL").arg(format!("-{pid}")).status();
        }
        #[cfg(not(unix))]
        {
            let _ = self.child.kill();
        }
        let _ = self.child.wait();
    }
}

fn pump<R: std::io::Read>(reader: BufReader<R>, tx: Sender<String>) {
    for line in reader.lines() {
        match line {
            Ok(line) => {
                if tx.send(line).is_err() {
                    return;
                }
            }
            Err(_) => return,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    use std::time::{Duration, Instant};

    #[test]
    fn streams_output_from_a_background_command() {
        let runner = ShellProcessRunner::new();
        let command = ShellCommand::create("echo hello-from-child").unwrap();
        let mut handle = runner.start(&command, &PathBuf::from(".")).unwrap();

        let deadline = Instant::now() + Duration::from_secs(5);
        let mut lines = Vec::new();
        while Instant::now() < deadline && !lines.iter().any(|l: &String| l.contains("hello-from-child")) {
            lines.extend(handle.drain_output());
            if handle.try_wait().is_some() {
                lines.extend(handle.drain_output());
                break;
            }
            thread::sleep(Duration::from_millis(20));
        }

        assert!(lines.iter().any(|l| l.contains("hello-from-child")), "got: {lines:?}");
    }

    #[test]
    fn kill_terminates_the_process_group() {
        let runner = ShellProcessRunner::new();
        let command = ShellCommand::create("sleep 30").unwrap();
        let mut handle = runner.start(&command, &PathBuf::from(".")).unwrap();

        assert!(handle.try_wait().is_none());
        handle.kill();
        assert!(handle.try_wait().is_some());
    }
}
