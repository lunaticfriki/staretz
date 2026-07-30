use std::collections::HashMap;

use crate::domain::ports::pty_runner::PtyHandle;
use crate::domain::value_objects::pty_size::PtySize;
use crate::domain::value_objects::tab_id::TabId;

pub struct ResizePtyTabCommand {
    pub tab_id: TabId,
    pub size: PtySize,
}

#[derive(Default)]
pub struct ResizePtyTabCommandHandler;

impl ResizePtyTabCommandHandler {
    pub fn new() -> Self {
        ResizePtyTabCommandHandler
    }

    /// No-op if the tab isn't running a pty.
    pub fn handle(&self, handles: &mut HashMap<TabId, Box<dyn PtyHandle>>, command: ResizePtyTabCommand) {
        if let Some(handle) = handles.get_mut(&command.tab_id) {
            handle.resize(command.size);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::ports::process_runner::ProcessError;
    use crate::domain::value_objects::tab_name::TabName;
    use crate::domain::value_objects::terminal_snapshot::TerminalSnapshot;
    use std::cell::Cell;
    use std::rc::Rc;

    struct FakeHandle {
        last_size: Rc<Cell<Option<PtySize>>>,
    }
    impl PtyHandle for FakeHandle {
        fn write_input(&mut self, _bytes: &[u8]) -> Result<(), ProcessError> {
            Ok(())
        }
        fn resize(&mut self, size: PtySize) {
            self.last_size.set(Some(size));
        }
        fn snapshot(&mut self) -> TerminalSnapshot {
            TerminalSnapshot::new(vec![], 0, 0, false)
        }
        fn try_wait(&mut self) -> Option<i32> {
            None
        }
        fn kill(&mut self) {}
    }

    #[test]
    fn resizes_the_running_handle() {
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());
        let last_size = Rc::new(Cell::new(None));
        let mut handles: HashMap<TabId, Box<dyn PtyHandle>> = HashMap::new();
        handles.insert(tab_id.clone(), Box::new(FakeHandle { last_size: last_size.clone() }));

        ResizePtyTabCommandHandler::new()
            .handle(&mut handles, ResizePtyTabCommand { tab_id, size: PtySize::new(40, 100) });

        assert_eq!(last_size.get(), Some(PtySize::new(40, 100)));
    }
}
