/// A plain-data snapshot of what a pseudo-terminal pane would show right
/// now: a grid of styled cells plus cursor state. Produced by a
/// `PtyHandle` (behind the `PtyRunner` port) from whatever terminal-
/// emulation library the infrastructure adapter uses internally — the
/// domain only ever sees this shape, so no terminal-emulation crate leaks
/// past the port boundary, and presentation renders it with its own
/// widgets rather than a third-party terminal-widget crate.
#[derive(Debug, Clone, PartialEq)]
pub struct TerminalSnapshot {
    rows: Vec<Vec<TerminalCell>>,
    cursor_row: u16,
    cursor_col: u16,
    cursor_visible: bool,
}

impl TerminalSnapshot {
    pub fn new(rows: Vec<Vec<TerminalCell>>, cursor_row: u16, cursor_col: u16, cursor_visible: bool) -> Self {
        TerminalSnapshot { rows, cursor_row, cursor_col, cursor_visible }
    }

    pub fn rows(&self) -> &[Vec<TerminalCell>] {
        &self.rows
    }

    /// (row, col) of the cursor, zero-indexed from the top-left cell.
    pub fn cursor(&self) -> (u16, u16) {
        (self.cursor_row, self.cursor_col)
    }

    pub fn cursor_visible(&self) -> bool {
        self.cursor_visible
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct TerminalCell {
    pub ch: char,
    pub fg: TerminalColor,
    pub bg: TerminalColor,
    pub bold: bool,
    pub italic: bool,
    pub underline: bool,
    pub inverse: bool,
}

impl TerminalCell {
    pub fn blank() -> Self {
        TerminalCell {
            ch: ' ',
            fg: TerminalColor::Default,
            bg: TerminalColor::Default,
            bold: false,
            italic: false,
            underline: false,
            inverse: false,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TerminalColor {
    Default,
    Indexed(u8),
    Rgb(u8, u8, u8),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn blank_cell_is_a_plain_space() {
        let cell = TerminalCell::blank();
        assert_eq!(cell.ch, ' ');
        assert_eq!(cell.fg, TerminalColor::Default);
        assert_eq!(cell.bg, TerminalColor::Default);
        assert!(!cell.bold && !cell.italic && !cell.underline && !cell.inverse);
    }

    #[test]
    fn exposes_rows_and_cursor_state() {
        let snapshot = TerminalSnapshot::new(vec![vec![TerminalCell::blank()]], 2, 5, true);

        assert_eq!(snapshot.rows().len(), 1);
        assert_eq!(snapshot.cursor(), (2, 5));
        assert!(snapshot.cursor_visible());
    }
}
