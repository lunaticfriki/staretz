use crate::domain::value_objects::doc_entry::DocEntry;

/// Port: the domain declares that it needs a list of markdown docs and
/// the ability to read one, fetched from somewhere; infrastructure
/// decides where from (the filesystem, today).
pub trait DocsRepository {
    fn list(&self) -> Result<Vec<DocEntry>, DocsLoadError>;
    fn read(&self, entry: &DocEntry) -> Result<String, DocsLoadError>;
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
#[error("failed to load docs: {0}")]
pub struct DocsLoadError(String);

impl DocsLoadError {
    pub fn new(message: impl Into<String>) -> Self {
        DocsLoadError(message.into())
    }
}
