use std::collections::HashMap;

use crate::domain::entities::menu::Menu;
use crate::domain::ports::process_runner::RunningHandle;
use crate::domain::value_objects::tab_id::TabId;

/// Pulls any newly-arrived output and exit status from every running tab's
/// handle and feeds it into the tab's own state. Run once per UI tick —
/// this is the polling equivalent of the reactive push a Signal would give
/// in the Preact app (see cli/ARCHITECTURE.md for why there's no
/// state-service/Signal here).
pub struct SyncTabsCommand;

#[derive(Default)]
pub struct SyncTabsCommandHandler;

impl SyncTabsCommandHandler {
    pub fn new() -> Self {
        SyncTabsCommandHandler
    }

    pub fn handle(
        &self,
        menu: &mut Menu,
        handles: &mut HashMap<TabId, Box<dyn RunningHandle>>,
        _command: SyncTabsCommand,
    ) {
        for tab in menu.tabs_mut() {
            let mut exit_code = None;

            if let Some(handle) = handles.get_mut(tab.id()) {
                for line in handle.drain_output() {
                    tab.push_output(line);
                }
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
    use crate::domain::value_objects::tab_name::TabName;
    use crate::test_support::menu_entry_mother;

    struct FakeHandle {
        output: Vec<String>,
        exit_code: Option<i32>,
    }
    impl RunningHandle for FakeHandle {
        fn drain_output(&mut self) -> Vec<String> {
            std::mem::take(&mut self.output)
        }
        fn try_wait(&mut self) -> Option<i32> {
            self.exit_code
        }
        fn kill(&mut self) {}
    }

    #[test]
    fn drains_output_into_the_tab() {
        let mut menu = Menu::create(vec![menu_entry_mother("Server")]).unwrap();
        let tab_id = TabId::from_name(&TabName::create("Server").unwrap());
        menu.tab_mut(&tab_id).unwrap().mark_running();
        let mut handles: HashMap<TabId, Box<dyn RunningHandle>> = HashMap::new();
        handles.insert(
            tab_id.clone(),
            Box::new(FakeHandle { output: vec!["hello".into()], exit_code: None }),
        );

        SyncTabsCommandHandler::new().handle(&mut menu, &mut handles, SyncTabsCommand);

        assert_eq!(menu.tab_mut(&tab_id).unwrap().output_lines(), ["hello"]);
        assert!(handles.contains_key(&tab_id));
    }

    #[test]
    fn marks_the_tab_exited_and_drops_the_handle_once_the_process_exits() {
        let mut menu = Menu::create(vec![menu_entry_mother("Server")]).unwrap();
        let tab_id = TabId::from_name(&TabName::create("Server").unwrap());
        menu.tab_mut(&tab_id).unwrap().mark_running();
        let mut handles: HashMap<TabId, Box<dyn RunningHandle>> = HashMap::new();
        handles.insert(
            tab_id.clone(),
            Box::new(FakeHandle { output: vec![], exit_code: Some(1) }),
        );

        SyncTabsCommandHandler::new().handle(&mut menu, &mut handles, SyncTabsCommand);

        let tab = menu.tab_mut(&tab_id).unwrap();
        assert!(!tab.is_running());
        assert_eq!(tab.output_lines(), ["[exited with code 1]"]);
        assert!(!handles.contains_key(&tab_id));
    }
}
