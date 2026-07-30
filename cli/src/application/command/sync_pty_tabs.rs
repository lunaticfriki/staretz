use std::collections::HashMap;

use crate::domain::entities::menu::Menu;
use crate::domain::ports::pty_runner::PtyHandle;
use crate::domain::value_objects::tab_id::TabId;

/// Pulls the latest rendered screen and exit status from every running
/// pty's handle and feeds it into the tab's own state. Run once per UI
/// tick, alongside `SyncTabsCommand` — see its doc comment for why this is
/// polling rather than push-based.
pub struct SyncPtyTabsCommand;

#[derive(Default)]
pub struct SyncPtyTabsCommandHandler;

impl SyncPtyTabsCommandHandler {
    pub fn new() -> Self {
        SyncPtyTabsCommandHandler
    }

    pub fn handle(
        &self,
        menu: &mut Menu,
        handles: &mut HashMap<TabId, Box<dyn PtyHandle>>,
        _command: SyncPtyTabsCommand,
    ) {
        for tab in menu.tabs_mut() {
            let mut exit_code = None;

            if let Some(handle) = handles.get_mut(tab.id()) {
                tab.apply_pty_snapshot(handle.snapshot());
                exit_code = handle.try_wait();
            }

            if let Some(code) = exit_code {
                handles.remove(tab.id());
                tab.mark_exited(code);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::ports::process_runner::ProcessError;
    use crate::domain::value_objects::pty_size::PtySize;
    use crate::domain::value_objects::tab_name::TabName;
    use crate::domain::value_objects::terminal_snapshot::{TerminalCell, TerminalSnapshot};
    use crate::test_support::interactive_menu_entry_mother;

    struct FakeHandle {
        exit_code: Option<i32>,
    }
    impl PtyHandle for FakeHandle {
        fn write_input(&mut self, _bytes: &[u8]) -> Result<(), ProcessError> {
            Ok(())
        }
        fn resize(&mut self, _size: PtySize) {}
        fn snapshot(&mut self) -> TerminalSnapshot {
            TerminalSnapshot::new(vec![vec![TerminalCell { ch: 'x', ..TerminalCell::blank() }]], 0, 0, true)
        }
        fn try_wait(&mut self) -> Option<i32> {
            self.exit_code
        }
        fn kill(&mut self) {}
    }

    #[test]
    fn applies_the_latest_snapshot_to_the_tab() {
        let mut menu = Menu::create(vec![interactive_menu_entry_mother("Claude")]).unwrap();
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());
        menu.tab_mut(&tab_id).unwrap().mark_running();
        let mut handles: HashMap<TabId, Box<dyn PtyHandle>> = HashMap::new();
        handles.insert(tab_id.clone(), Box::new(FakeHandle { exit_code: None }));

        SyncPtyTabsCommandHandler::new().handle(&mut menu, &mut handles, SyncPtyTabsCommand);

        let snapshot = menu.tab_mut(&tab_id).unwrap().pty_snapshot().unwrap();
        assert_eq!(snapshot.rows()[0][0].ch, 'x');
        assert!(handles.contains_key(&tab_id));
    }

    #[test]
    fn marks_the_tab_exited_and_drops_the_handle_once_the_process_exits() {
        let mut menu = Menu::create(vec![interactive_menu_entry_mother("Claude")]).unwrap();
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());
        menu.tab_mut(&tab_id).unwrap().mark_running();
        let mut handles: HashMap<TabId, Box<dyn PtyHandle>> = HashMap::new();
        handles.insert(tab_id.clone(), Box::new(FakeHandle { exit_code: Some(1) }));

        SyncPtyTabsCommandHandler::new().handle(&mut menu, &mut handles, SyncPtyTabsCommand);

        let tab = menu.tab_mut(&tab_id).unwrap();
        assert!(!tab.is_running());
        assert_eq!(tab.output_lines(), ["[exited with code 1]"]);
        assert!(!handles.contains_key(&tab_id));
    }
}
