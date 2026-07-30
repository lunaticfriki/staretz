use std::collections::HashMap;

use crate::domain::ports::pty_runner::PtyHandle;
use crate::domain::value_objects::tab_id::TabId;

pub struct WriteToPtyTabCommand {
    pub tab_id: TabId,
    pub bytes: Vec<u8>,
}

#[derive(Default)]
pub struct WriteToPtyTabCommandHandler;

impl WriteToPtyTabCommandHandler {
    pub fn new() -> Self {
        WriteToPtyTabCommandHandler
    }

    /// No-op if the tab isn't running a pty — keystrokes typed after a
    /// program has exited have nowhere to go.
    pub fn handle(&self, handles: &mut HashMap<TabId, Box<dyn PtyHandle>>, command: WriteToPtyTabCommand) {
        if let Some(handle) = handles.get_mut(&command.tab_id) {
            let _ = handle.write_input(&command.bytes);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::ports::process_runner::ProcessError;
    use crate::domain::value_objects::pty_size::PtySize;
    use crate::domain::value_objects::tab_name::TabName;
    use crate::domain::value_objects::terminal_snapshot::TerminalSnapshot;
    use std::cell::RefCell;
    use std::rc::Rc;

    struct FakeHandle {
        received: Rc<RefCell<Vec<u8>>>,
    }
    impl PtyHandle for FakeHandle {
        fn write_input(&mut self, bytes: &[u8]) -> Result<(), ProcessError> {
            self.received.borrow_mut().extend_from_slice(bytes);
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

    #[test]
    fn forwards_bytes_to_the_running_handle() {
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());
        let received = Rc::new(RefCell::new(Vec::new()));
        let mut handles: HashMap<TabId, Box<dyn PtyHandle>> = HashMap::new();
        handles.insert(tab_id.clone(), Box::new(FakeHandle { received: received.clone() }));

        WriteToPtyTabCommandHandler::new().handle(&mut handles, WriteToPtyTabCommand { tab_id, bytes: b"hi".to_vec() });

        assert_eq!(*received.borrow(), b"hi");
    }

    #[test]
    fn is_a_no_op_when_not_running() {
        let tab_id = TabId::from_name(&TabName::create("Claude").unwrap());
        let mut handles: HashMap<TabId, Box<dyn PtyHandle>> = HashMap::new();

        WriteToPtyTabCommandHandler::new().handle(&mut handles, WriteToPtyTabCommand { tab_id, bytes: b"hi".to_vec() });
    }
}
