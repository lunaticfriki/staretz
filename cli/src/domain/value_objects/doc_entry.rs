use std::path::{Path, PathBuf};

/// One markdown file under the docs root, identified by its path relative
/// to that root (e.g. `modules/dashboard.md`). Unlike `MenuEntry`, this
/// carries no process/command state — the docs browser has nothing to
/// run, just files to list and read.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DocEntry {
    path: PathBuf,
}

impl DocEntry {
    pub fn create(path: PathBuf) -> Self {
        DocEntry { path }
    }

    pub fn path(&self) -> &Path {
        &self.path
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exposes_its_relative_path() {
        let entry = DocEntry::create(PathBuf::from("modules/dashboard.md"));

        assert_eq!(entry.path(), Path::new("modules/dashboard.md"));
    }
}
