/// A bounded log of output lines for one tab. Immutable like a value
/// object — `push` returns a new `OutputLog` rather than mutating in place —
/// and owns the one piece of collection-level behavior it has: limiting
/// itself to the most recent `MAX_LINES` so a long-running dev server can't
/// grow the log without bound.
const MAX_LINES: usize = 2000;

#[derive(Debug, Clone, Default)]
pub struct OutputLog {
    lines: Vec<String>,
}

impl OutputLog {
    pub fn empty() -> Self {
        OutputLog { lines: Vec::new() }
    }

    #[must_use]
    pub fn push(mut self, line: String) -> Self {
        self.lines.push(line);
        if self.lines.len() > MAX_LINES {
            let excess = self.lines.len() - MAX_LINES;
            self.lines.drain(0..excess);
        }
        self
    }

    pub fn as_slice(&self) -> &[String] {
        &self.lines
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn starts_empty() {
        assert!(OutputLog::empty().as_slice().is_empty());
    }

    #[test]
    fn push_appends_and_returns_a_new_log() {
        let log = OutputLog::empty().push("first".into()).push("second".into());
        assert_eq!(log.as_slice(), ["first", "second"]);
    }

    #[test]
    fn truncates_to_the_most_recent_max_lines() {
        let mut log = OutputLog::empty();
        for i in 0..(MAX_LINES + 10) {
            log = log.push(i.to_string());
        }
        assert_eq!(log.as_slice().len(), MAX_LINES);
        assert_eq!(log.as_slice().first().unwrap(), "10");
        assert_eq!(log.as_slice().last().unwrap(), &(MAX_LINES + 9).to_string());
    }
}
