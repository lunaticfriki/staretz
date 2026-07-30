use crate::domain::value_objects::menu_entry::MenuEntry;

/// Port: the domain declares that it needs a list of configured entries
/// fetched from somewhere; infrastructure decides where from (a TOML file,
/// on disk, today).
pub trait MenuRepository {
    fn load(&self) -> Result<Vec<MenuEntry>, MenuLoadError>;
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
#[error("failed to load menu: {0}")]
pub struct MenuLoadError(String);

impl MenuLoadError {
    pub fn new(message: impl Into<String>) -> Self {
        MenuLoadError(message.into())
    }
}
