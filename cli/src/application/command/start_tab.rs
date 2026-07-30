use std::collections::HashMap;
use std::sync::Arc;

use crate::domain::entities::menu::Menu;
use crate::domain::errors::tab_error::TabNotFoundError;
use crate::domain::ports::process_runner::{ProcessError, ProcessRunner, RunningHandle};
use crate::domain::value_objects::tab_id::TabId;

pub struct StartTabCommand {
    pub tab_id: TabId,
}

pub struct StartTabCommandHandler {
    runner: Arc<dyn ProcessRunner>,
}

impl StartTabCommandHandler {
    pub fn new(runner: Arc<dyn ProcessRunner>) -> Self {
        StartTabCommandHandler { runner }
    }

    /// No-op if the tab is already running — starting an already-running
    /// tab isn't an error, it just has nothing to do.
    pub fn handle(
        &self,
        menu: &mut Menu,
        handles: &mut HashMap<TabId, Box<dyn RunningHandle>>,
        command: StartTabCommand,
    ) -> Result<(), StartTabError> {
        let tab = menu
            .tab_mut(&command.tab_id)
            .ok_or_else(|| TabNotFoundError::new(&command.tab_id))?;

        if tab.is_running() {
            return Ok(());
        }

        let handle = self.runner.start(tab.entry().command(), tab.entry().cwd())?;
        handles.insert(command.tab_id, handle);
        tab.mark_running();
        Ok(())
    }
}

#[derive(Debug, thiserror::Error)]
pub enum StartTabError {
    #[error(transparent)]
    NotFound(#[from] TabNotFoundError),
    #[error(transparent)]
    Process(#[from] ProcessError),
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::value_objects::tab_name::TabName;
    use crate::test_support::menu_entry_mother;
    use std::path::Path;

    struct FakeRunner {
        fails: bool,
    }

    struct FakeHandle;
    impl RunningHandle for FakeHandle {
        fn drain_output(&mut self) -> Vec<String> {
            vec![]
        }
        fn try_wait(&mut self) -> Option<i32> {
            None
        }
        fn kill(&mut self) {}
    }

    impl ProcessRunner for FakeRunner {
        fn start(&self, _command: &crate::domain::value_objects::shell_command::ShellCommand, _cwd: &Path) -> Result<Box<dyn RunningHandle>, ProcessError> {
            if self.fails {
                Err(ProcessError::new("boom"))
            } else {
                Ok(Box::new(FakeHandle))
            }
        }
    }

    #[test]
    fn starts_the_tab_and_registers_its_handle() {
        let mut menu = Menu::create(vec![menu_entry_mother("Server")]).unwrap();
        let mut handles = HashMap::new();
        let handler = StartTabCommandHandler::new(Arc::new(FakeRunner { fails: false }));
        let tab_id = TabId::from_name(&TabName::create("Server").unwrap());

        handler
            .handle(&mut menu, &mut handles, StartTabCommand { tab_id: tab_id.clone() })
            .unwrap();

        assert!(menu.tab_mut(&tab_id).unwrap().is_running());
        assert!(handles.contains_key(&tab_id));
    }

    #[test]
    fn is_a_no_op_when_already_running() {
        let mut menu = Menu::create(vec![menu_entry_mother("Server")]).unwrap();
        let mut handles = HashMap::new();
        let handler = StartTabCommandHandler::new(Arc::new(FakeRunner { fails: false }));
        let tab_id = TabId::from_name(&TabName::create("Server").unwrap());

        handler
            .handle(&mut menu, &mut handles, StartTabCommand { tab_id: tab_id.clone() })
            .unwrap();
        handler
            .handle(&mut menu, &mut handles, StartTabCommand { tab_id: tab_id.clone() })
            .unwrap();

        assert_eq!(handles.len(), 1);
    }

    #[test]
    fn surfaces_a_process_error() {
        let mut menu = Menu::create(vec![menu_entry_mother("Server")]).unwrap();
        let mut handles = HashMap::new();
        let handler = StartTabCommandHandler::new(Arc::new(FakeRunner { fails: true }));
        let tab_id = TabId::from_name(&TabName::create("Server").unwrap());

        let result = handler.handle(&mut menu, &mut handles, StartTabCommand { tab_id });

        assert!(matches!(result, Err(StartTabError::Process(_))));
    }

    #[test]
    fn surfaces_tab_not_found() {
        let mut menu = Menu::create(vec![menu_entry_mother("Server")]).unwrap();
        let mut handles = HashMap::new();
        let handler = StartTabCommandHandler::new(Arc::new(FakeRunner { fails: false }));
        let missing_id = TabId::from_name(&TabName::create("Missing").unwrap());

        let result = handler.handle(&mut menu, &mut handles, StartTabCommand { tab_id: missing_id });

        assert!(matches!(result, Err(StartTabError::NotFound(_))));
    }
}
