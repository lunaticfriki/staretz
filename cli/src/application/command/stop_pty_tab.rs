use std::collections::HashMap;

use crate::domain::entities::menu::Menu;
use crate::domain::errors::tab_error::TabNotFoundError;
use crate::domain::ports::pty_runner::PtyHandle;
use crate::domain::value_objects::tab_id::TabId;

pub struct StopPtyTabCommand {
    pub tab_id: TabId,
}

#[derive(Default)]
pub struct StopPtyTabCommandHandler;

impl StopPtyTabCommandHandler {
    pub fn new() -> Self {
        StopPtyTabCommandHandler
    }

    /// No-op if the tab isn't running — there's nothing to stop.
    pub fn handle(
        &self,
        menu: &mut Menu,
        handles: &mut HashMap<TabId, Box<dyn PtyHandle>>,
        command: StopPtyTabCommand,
    ) -> Result<(), TabNotFoundError> {
        let tab = menu
            .tab_mut(&command.tab_id)
            .ok_or_else(|| TabNotFoundError::new(&command.tab_id))?;

        if let Some(mut handle) = handles.remove(&command.tab_id) {
            handle.kill();
            tab.mark_stopped();
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::ports::process_runner::ProcessError;
    use crate::domain::value_objects::pty_size::PtySize;
    use crate::domain::value_objects::tab_name::TabName;
    use crate::domain::value_objects::terminal_snapshot::TerminalSnapshot;
    use crate::test_support::interactive_menu_entry_mother;

    struct FakeHandle {
        killed: std::rc::Rc<std::cell::Cell<bool>>,
    }
    impl PtyHandle for FakeHandle {
        fn write_input(&mut self, _bytes: &[u8]) -> Result<(), ProcessError> {
            Ok(())
        }
        fn resize(&mut self, _size: PtySize) {}
        fn snapshot(&mut self) -> TerminalSnapshot {
            TerminalSnapshot::new(vec![], 0, 0, false)
        }
        fn try_wait(&mut self) -> Option<i32> {
            None
        }
        fn kill(&mut self) {
            self.killed.set(true);
        }
    }

    #[test]
    fn kills_the_handle_and_marks_the_tab_stopped() {
        let mut menu = Menu::create(vec![interactive_menu_entry_mother("Claude")]).unwrap();
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());
        let killed = std::rc::Rc::new(std::cell::Cell::new(false));
        let mut handles: HashMap<TabId, Box<dyn PtyHandle>> = HashMap::new();
        handles.insert(tab_id.clone(), Box::new(FakeHandle { killed: killed.clone() }));
        menu.tab_mut(&tab_id).unwrap().mark_running();

        StopPtyTabCommandHandler::new()
            .handle(&mut menu, &mut handles, StopPtyTabCommand { tab_id: tab_id.clone() })
            .unwrap();

        assert!(killed.get());
        assert!(!menu.tab_mut(&tab_id).unwrap().is_running());
        assert!(!handles.contains_key(&tab_id));
    }

    #[test]
    fn is_a_no_op_when_not_running() {
        let mut menu = Menu::create(vec![interactive_menu_entry_mother("Claude")]).unwrap();
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());
        let mut handles: HashMap<TabId, Box<dyn PtyHandle>> = HashMap::new();

        StopPtyTabCommandHandler::new()
            .handle(&mut menu, &mut handles, StopPtyTabCommand { tab_id: tab_id.clone() })
            .unwrap();

        assert!(menu.tab_mut(&tab_id).unwrap().output_lines().is_empty());
    }
}
