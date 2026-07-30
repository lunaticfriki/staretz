use std::sync::Arc;

use crate::domain::repositories::docs_repository::{DocsLoadError, DocsRepository};
use crate::domain::value_objects::doc_entry::DocEntry;

/// Facade presentation depends on for the docs browser, playing the same
/// role `MenuAppService` plays for process tabs. It's a single struct
/// rather than command/query handlers because there's no aggregate with
/// mutation rules to justify splitting further — just two direct
/// pass-throughs to the port, the same "no actual benefit" reasoning
/// `MenuAppService` itself uses to justify merging its three roles.
pub struct DocsAppService {
    repository: Arc<dyn DocsRepository>,
    entries: Vec<DocEntry>,
}

impl DocsAppService {
    pub fn new(repository: Arc<dyn DocsRepository>) -> Result<Self, DocsLoadError> {
        let entries = repository.list()?;
        Ok(DocsAppService { repository, entries })
    }

    pub fn entries(&self) -> &[DocEntry] {
        &self.entries
    }

    pub fn read(&self, entry: &DocEntry) -> Result<String, DocsLoadError> {
        self.repository.read(entry)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    struct FakeRepository {
        entries: Vec<DocEntry>,
        content: Result<String, DocsLoadError>,
    }

    impl DocsRepository for FakeRepository {
        fn list(&self) -> Result<Vec<DocEntry>, DocsLoadError> {
            Ok(self.entries.clone())
        }

        fn read(&self, _entry: &DocEntry) -> Result<String, DocsLoadError> {
            self.content.clone()
        }
    }

    #[test]
    fn exposes_the_entries_loaded_at_construction() {
        let repository = FakeRepository {
            entries: vec![DocEntry::create(PathBuf::from("glossary.md"))],
            content: Ok(String::new()),
        };

        let service = DocsAppService::new(Arc::new(repository)).unwrap();

        assert_eq!(service.entries(), [DocEntry::create(PathBuf::from("glossary.md"))]);
    }

    #[test]
    fn delegates_read_to_the_repository() {
        let repository = FakeRepository {
            entries: vec![],
            content: Ok("# Hello".to_string()),
        };
        let service = DocsAppService::new(Arc::new(repository)).unwrap();
        let entry = DocEntry::create(PathBuf::from("glossary.md"));

        assert_eq!(service.read(&entry).unwrap(), "# Hello");
    }

    #[test]
    fn surfaces_a_read_error_from_the_repository_unchanged() {
        let repository = FakeRepository {
            entries: vec![],
            content: Err(DocsLoadError::new("boom")),
        };
        let service = DocsAppService::new(Arc::new(repository)).unwrap();
        let entry = DocEntry::create(PathBuf::from("glossary.md"));

        assert_eq!(service.read(&entry), Err(DocsLoadError::new("boom")));
    }
}
