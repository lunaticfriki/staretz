use std::fmt;

use crate::domain::collections::output_log::OutputLog;
use crate::domain::value_objects::menu_entry::MenuEntry;
use crate::domain::value_objects::process_status::ProcessStatus;
use crate::domain::value_objects::tab_id::TabId;
use crate::domain::value_objects::terminal_snapshot::TerminalSnapshot;

/// A tab tracks the status and accumulated output of one configured
/// command. It deliberately does NOT hold a handle to the OS process
/// backing it — that would let a domain entity reach out to I/O directly.
/// The live handle is bookkept by the application layer
/// (`MenuAppService`), which feeds this entity's pure mutation methods
/// with what it learns from the `ProcessRunner`/`PtyRunner` ports.
pub struct Tab {
    id: TabId,
    entry: MenuEntry,
    status: ProcessStatus,
    output: OutputLog,
    pty_snapshot: Option<TerminalSnapshot>,
}

impl Tab {
    pub fn create(entry: MenuEntry) -> Self {
        let id = TabId::from_name(entry.name());
        Tab {
            id,
            entry,
            status: ProcessStatus::NotStarted,
            output: OutputLog::empty(),
            pty_snapshot: None,
        }
    }

    pub fn id(&self) -> &TabId {
        &self.id
    }

    pub fn entry(&self) -> &MenuEntry {
        &self.entry
    }

    pub fn status(&self) -> ProcessStatus {
        self.status
    }

    pub fn output_lines(&self) -> &[String] {
        self.output.as_slice()
    }

    pub fn pty_snapshot(&self) -> Option<&TerminalSnapshot> {
        self.pty_snapshot.as_ref()
    }

    pub fn is_running(&self) -> bool {
        self.status.is_running()
    }

    pub fn is_interactive(&self) -> bool {
        self.entry.is_interactive()
    }

    pub fn mark_running(&mut self) {
        self.status = ProcessStatus::Running;
        self.output = OutputLog::empty();
        self.pty_snapshot = None;
    }

    pub fn mark_exited(&mut self, code: i32) {
        self.status = ProcessStatus::Exited { code };
        self.push_output(format!("[exited with code {code}]"));
    }

    pub fn mark_stopped(&mut self) {
        self.status = ProcessStatus::Stopped;
        self.push_output("[stopped]".to_string());
    }

    pub fn apply_pty_snapshot(&mut self, snapshot: TerminalSnapshot) {
        self.pty_snapshot = Some(snapshot);
    }

    pub fn mark_launch_failed(&mut self, message: impl fmt::Display) {
        self.status = ProcessStatus::Stopped;
        self.push_output(format!("[failed to launch: {message}]"));
    }

    pub fn push_output(&mut self, line: String) {
        self.output = std::mem::take(&mut self.output).push(line);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_support::menu_entry_mother;

    #[test]
    fn starts_not_running_with_no_output() {
        let tab = Tab::create(menu_entry_mother("Server"));

        assert!(!tab.is_running());
        assert!(tab.output_lines().is_empty());
        assert_eq!(tab.id().as_str(), "Server");
    }

    #[test]
    fn mark_running_clears_previous_output() {
        let mut tab = Tab::create(menu_entry_mother("Server"));
        tab.push_output("stale from a previous run".into());

        tab.mark_running();

        assert!(tab.is_running());
        assert!(tab.output_lines().is_empty());
    }

    #[test]
    fn mark_exited_stops_running_and_logs_the_code() {
        let mut tab = Tab::create(menu_entry_mother("Server"));
        tab.mark_running();

        tab.mark_exited(1);

        assert!(!tab.is_running());
        assert_eq!(tab.output_lines(), ["[exited with code 1]"]);
    }

    #[test]
    fn apply_pty_snapshot_stores_it_and_mark_running_clears_it() {
        use crate::domain::value_objects::terminal_snapshot::{TerminalCell, TerminalSnapshot};

        let mut tab = Tab::create(menu_entry_mother("Claude"));
        tab.mark_running();
        tab.apply_pty_snapshot(TerminalSnapshot::new(vec![vec![TerminalCell::blank()]], 0, 0, true));
        assert!(tab.pty_snapshot().is_some());

        tab.mark_running();

        assert!(tab.pty_snapshot().is_none());
    }

    #[test]
    fn mark_stopped_logs_a_stopped_marker() {
        let mut tab = Tab::create(menu_entry_mother("Server"));
        tab.mark_running();

        tab.mark_stopped();

        assert!(!tab.is_running());
        assert_eq!(tab.output_lines(), ["[stopped]"]);
    }
}
