use crate::domain::value_objects::tab_name::TabName;

#[derive(Debug, thiserror::Error)]
pub enum MenuError {
    #[error(transparent)]
    Empty(#[from] EmptyMenuError),
    #[error(transparent)]
    DuplicateName(#[from] DuplicateTabNameError),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
#[error("menu.toml must declare at least one [[entry]]")]
pub struct EmptyMenuError;

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
#[error("duplicate tab name \"{0}\"")]
pub struct DuplicateTabNameError(String);

impl DuplicateTabNameError {
    pub fn new(name: &TabName) -> Self {
        DuplicateTabNameError(name.to_string())
    }
}
