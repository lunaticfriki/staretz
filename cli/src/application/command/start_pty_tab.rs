use std::collections::HashMap;
use std::sync::Arc;

use crate::domain::entities::menu::Menu;
use crate::domain::errors::tab_error::TabNotFoundError;
use crate::domain::ports::pty_runner::{PtyHandle, PtyRunner};
use crate::domain::ports::process_runner::ProcessError;
use crate::domain::value_objects::pty_size::PtySize;
use crate::domain::value_objects::tab_id::TabId;

pub struct StartPtyTabCommand {
    pub tab_id: TabId,
    pub size: PtySize,
}

pub struct StartPtyTabCommandHandler {
    runner: Arc<dyn PtyRunner>,
}

impl StartPtyTabCommandHandler {
    pub fn new(runner: Arc<dyn PtyRunner>) -> Self {
        StartPtyTabCommandHandler { runner }
    }

    /// No-op if the tab is already running — pressing Enter to (re)focus an
    /// already-running interactive tab shouldn't restart it.
    pub fn handle(
        &self,
        menu: &mut Menu,
        handles: &mut HashMap<TabId, Box<dyn PtyHandle>>,
        command: StartPtyTabCommand,
    ) -> Result<(), StartPtyTabError> {
        let tab = menu
            .tab_mut(&command.tab_id)
            .ok_or_else(|| TabNotFoundError::new(&command.tab_id))?;

        if tab.is_running() {
            return Ok(());
        }

        let handle = self.runner.start(tab.entry().command(), tab.entry().cwd(), command.size)?;
        handles.insert(command.tab_id, handle);
        tab.mark_running();
        Ok(())
    }
}

#[derive(Debug, thiserror::Error)]
pub enum StartPtyTabError {
    #[error(transparent)]
    NotFound(#[from] TabNotFoundError),
    #[error(transparent)]
    Process(#[from] ProcessError),
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::value_objects::shell_command::ShellCommand;
    use crate::domain::value_objects::tab_name::TabName;
    use crate::domain::value_objects::terminal_snapshot::TerminalSnapshot;
    use crate::test_support::interactive_menu_entry_mother;
    use std::path::Path;

    struct FakeRunner {
        fails: bool,
    }

    struct FakeHandle;
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
        fn kill(&mut self) {}
    }

    impl PtyRunner for FakeRunner {
        fn start(&self, _command: &ShellCommand, _cwd: &Path, _size: PtySize) -> Result<Box<dyn PtyHandle>, ProcessError> {
            if self.fails {
                Err(ProcessError::new("boom"))
            } else {
                Ok(Box::new(FakeHandle))
            }
        }
    }

    #[test]
    fn starts_the_tab_and_registers_its_handle() {
        let mut menu = Menu::create(vec![interactive_menu_entry_mother("Claude")]).unwrap();
        let mut handles = HashMap::new();
        let handler = StartPtyTabCommandHandler::new(Arc::new(FakeRunner { fails: false }));
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());

        handler
            .handle(&mut menu, &mut handles, StartPtyTabCommand { tab_id: tab_id.clone(), size: PtySize::new(24, 80) })
            .unwrap();

        assert!(menu.tab_mut(&tab_id).unwrap().is_running());
        assert!(handles.contains_key(&tab_id));
    }

    #[test]
    fn is_a_no_op_when_already_running() {
        let mut menu = Menu::create(vec![interactive_menu_entry_mother("Claude")]).unwrap();
        let mut handles = HashMap::new();
        let handler = StartPtyTabCommandHandler::new(Arc::new(FakeRunner { fails: false }));
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());

        handler
            .handle(&mut menu, &mut handles, StartPtyTabCommand { tab_id: tab_id.clone(), size: PtySize::new(24, 80) })
            .unwrap();
        handler
            .handle(&mut menu, &mut handles, StartPtyTabCommand { tab_id: tab_id.clone(), size: PtySize::new(24, 80) })
            .unwrap();

        assert_eq!(handles.len(), 1);
    }

    #[test]
    fn surfaces_a_process_error() {
        let mut menu = Menu::create(vec![interactive_menu_entry_mother("Claude")]).unwrap();
        let mut handles = HashMap::new();
        let handler = StartPtyTabCommandHandler::new(Arc::new(FakeRunner { fails: true }));
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());

        let result = handler.handle(
            &mut menu,
            &mut handles,
            StartPtyTabCommand { tab_id, size: PtySize::new(24, 80) },
        );

        assert!(matches!(result, Err(StartPtyTabError::Process(_))));
    }
}
