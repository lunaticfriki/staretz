use std::path::{Path, PathBuf};

use crate::domain::repositories::docs_repository::{DocsLoadError, DocsRepository};
use crate::domain::value_objects::doc_entry::DocEntry;

/// Adapter for the `DocsRepository` port, backed by the `docs/` directory.
/// Looks for one next to the current directory or the `cli/` crate dir,
/// the same two candidates `TomlMenuRepository` checks for `menu.toml` —
/// covers running the CLI from either the repo root or `cli/`. Unlike the
/// menu, there's no bundled default doc set to fall back to: if neither
/// candidate exists, `list()` just returns an empty `Vec`.
pub struct FsDocsRepository {
    root: PathBuf,
}

impl FsDocsRepository {
    pub fn discover() -> Self {
        let candidates = ["docs", "../docs"];
        let root = candidates
            .into_iter()
            .map(PathBuf::from)
            .find(|candidate| candidate.is_dir())
            .unwrap_or_else(|| PathBuf::from("docs"));
        FsDocsRepository { root }
    }
}

impl DocsRepository for FsDocsRepository {
    fn list(&self) -> Result<Vec<DocEntry>, DocsLoadError> {
        let mut entries = Vec::new();
        if self.root.is_dir() {
            collect_markdown_files(&self.root, &self.root, &mut entries)?;
        }
        entries.sort_by(|a, b| a.path().cmp(b.path()));
        Ok(entries)
    }

    fn read(&self, entry: &DocEntry) -> Result<String, DocsLoadError> {
        let path = self.root.join(entry.path());
        std::fs::read_to_string(&path).map_err(|err| DocsLoadError::new(format!("reading {}: {err}", path.display())))
    }
}

fn collect_markdown_files(root: &Path, dir: &Path, out: &mut Vec<DocEntry>) -> Result<(), DocsLoadError> {
    let read_dir = std::fs::read_dir(dir)
        .map_err(|err| DocsLoadError::new(format!("reading {}: {err}", dir.display())))?;

    for entry in read_dir {
        let entry = entry.map_err(|err| DocsLoadError::new(format!("reading {}: {err}", dir.display())))?;
        let path = entry.path();
        if path.is_dir() {
            collect_markdown_files(root, &path, out)?;
        } else if path.extension().and_then(|ext| ext.to_str()) == Some("md") {
            let relative = path
                .strip_prefix(root)
                .unwrap_or(&path)
                .to_path_buf();
            out.push(DocEntry::create(relative));
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    fn temp_dir(name: &str) -> PathBuf {
        std::env::temp_dir().join(format!("staretz-cli-docs-test-{name}-{}", std::process::id()))
    }

    fn write_file(path: &Path, contents: &str) {
        std::fs::create_dir_all(path.parent().unwrap()).unwrap();
        let mut file = std::fs::File::create(path).unwrap();
        file.write_all(contents.as_bytes()).unwrap();
    }

    #[test]
    fn lists_only_markdown_files_recursively_with_relative_paths() {
        let dir = temp_dir("list");
        write_file(&dir.join("README.md"), "# Root");
        write_file(&dir.join("modules/dashboard.md"), "# Dashboard");
        write_file(&dir.join("templates/commit.mjs"), "console.log('not markdown')");
        write_file(&dir.join(".DS_Store"), "junk");

        let repository = FsDocsRepository { root: dir.clone() };
        let entries = repository.list().unwrap();

        assert_eq!(
            entries.iter().map(|e| e.path().to_path_buf()).collect::<Vec<_>>(),
            vec![PathBuf::from("README.md"), PathBuf::from("modules/dashboard.md")],
        );

        std::fs::remove_dir_all(&dir).unwrap();
    }

    #[test]
    fn reads_the_contents_of_a_listed_entry() {
        let dir = temp_dir("read");
        write_file(&dir.join("glossary.md"), "# Glossary\n\nSome content.");

        let repository = FsDocsRepository { root: dir.clone() };
        let entry = DocEntry::create(PathBuf::from("glossary.md"));

        assert_eq!(repository.read(&entry).unwrap(), "# Glossary\n\nSome content.");

        std::fs::remove_dir_all(&dir).unwrap();
    }

    #[test]
    fn errors_reading_a_path_that_does_not_exist() {
        let dir = temp_dir("missing");
        std::fs::create_dir_all(&dir).unwrap();

        let repository = FsDocsRepository { root: dir.clone() };
        let entry = DocEntry::create(PathBuf::from("nope.md"));

        assert!(repository.read(&entry).is_err());

        std::fs::remove_dir_all(&dir).unwrap();
    }

    #[test]
    fn returns_an_empty_list_when_the_docs_root_does_not_exist() {
        let repository = FsDocsRepository {
            root: temp_dir("does-not-exist"),
        };

        assert_eq!(repository.list().unwrap(), vec![]);
    }
}
