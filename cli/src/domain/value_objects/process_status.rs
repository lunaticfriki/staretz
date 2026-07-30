#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum ProcessStatus {
    #[default]
    NotStarted,
    Running,
    Exited {
        code: i32,
    },
    Stopped,
}

impl ProcessStatus {
    pub fn is_running(self) -> bool {
        matches!(self, ProcessStatus::Running)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn only_running_reports_as_running() {
        assert!(!ProcessStatus::NotStarted.is_running());
        assert!(ProcessStatus::Running.is_running());
        assert!(!ProcessStatus::Exited { code: 0 }.is_running());
        assert!(!ProcessStatus::Stopped.is_running());
    }
}
