use crate::domain::entities::tab::Tab;
use crate::domain::value_objects::tab_id::TabId;
use crate::domain::value_objects::terminal_snapshot::TerminalSnapshot;

/// `Tab` has behavior and mutable state, so per the read-model rule it gets
/// a proper DTO rather than being handed to presentation directly.
#[derive(Debug, Clone)]
pub struct TabReadModel {
    pub id: TabId,
    pub name: String,
    pub command: String,
    pub interactive: bool,
    pub is_running: bool,
    pub output_lines: Vec<String>,
    pub pty_snapshot: Option<TerminalSnapshot>,
}

impl TabReadModel {
    pub fn from_domain(tab: &Tab) -> Self {
        TabReadModel {
            id: tab.id().clone(),
            name: tab.entry().name().to_string(),
            command: tab.entry().command().to_string(),
            interactive: tab.is_interactive(),
            is_running: tab.is_running(),
            output_lines: tab.output_lines().to_vec(),
            pty_snapshot: tab.pty_snapshot().cloned(),
        }
    }
}
