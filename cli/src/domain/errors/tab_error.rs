use crate::domain::value_objects::tab_id::TabId;

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
#[error("no tab found for id \"{0}\"")]
pub struct TabNotFoundError(String);

impl TabNotFoundError {
    pub fn new(id: &TabId) -> Self {
        TabNotFoundError(id.as_str().to_string())
    }
}
