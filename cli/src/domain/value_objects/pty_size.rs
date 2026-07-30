/// The dimensions of a pseudo-terminal pane, in character cells. Clamped
/// to at least 1x1 so infrastructure adapters never have to special-case a
/// zero-sized pty (which some pty implementations reject outright).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PtySize {
    rows: u16,
    cols: u16,
}

impl PtySize {
    pub fn new(rows: u16, cols: u16) -> Self {
        PtySize { rows: rows.max(1), cols: cols.max(1) }
    }

    pub fn rows(&self) -> u16 {
        self.rows
    }

    pub fn cols(&self) -> u16 {
        self.cols
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exposes_its_dimensions() {
        let size = PtySize::new(24, 80);
        assert_eq!(size.rows(), 24);
        assert_eq!(size.cols(), 80);
    }

    #[test]
    fn clamps_to_at_least_one_row_and_column() {
        let size = PtySize::new(0, 0);
        assert_eq!(size.rows(), 1);
        assert_eq!(size.cols(), 1);
    }
}
