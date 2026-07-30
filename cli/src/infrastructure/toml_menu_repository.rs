use std::path::{Path, PathBuf};

use serde::Deserialize;

use crate::domain::repositories::menu_repository::{MenuLoadError, MenuRepository};
use crate::domain::value_objects::menu_entry::MenuEntry;

use super::acl::menu_entry_mapper::{MenuEntryMapper, RawMenuEntry};

#[derive(Debug, Deserialize)]
struct RawConfig {
    entry: Vec<RawMenuEntry>,
}

const DEFAULT_MENU_TOML: &str = include_str!(concat!(env!("CARGO_MANIFEST_DIR"), "/menu.toml"));

/// Adapter for the `MenuRepository` port, backed by a `menu.toml` file.
/// Looks for one next to the current directory or the `cli/` crate dir,
/// falling back to the copy baked into the binary at build time so the
/// tool always has a working default menu regardless of cwd.
pub struct TomlMenuRepository {
    path: Option<PathBuf>,
}

impl TomlMenuRepository {
    pub fn discover() -> Self {
        let candidates = ["menu.toml", "cli/menu.toml"];
        let path = candidates
            .into_iter()
            .map(Path::new)
            .find(|candidate| candidate.exists())
            .map(Path::to_path_buf);
        TomlMenuRepository { path }
    }
}

impl MenuRepository for TomlMenuRepository {
    fn load(&self) -> Result<Vec<MenuEntry>, MenuLoadError> {
        let (text, config_dir) = self.read_source()?;
        let raw: RawConfig = toml::from_str(&text).map_err(|err| MenuLoadError::new(err.to_string()))?;
        raw.entry
            .into_iter()
            .map(|entry| MenuEntryMapper::to_domain(entry, &config_dir))
            .collect()
    }
}

impl TomlMenuRepository {
    fn read_source(&self) -> Result<(String, PathBuf), MenuLoadError> {
        match &self.path {
            Some(path) => {
                let text = std::fs::read_to_string(path)
                    .map_err(|err| MenuLoadError::new(format!("reading {}: {err}", path.display())))?;
                let config_dir = path
                    .parent()
                    .filter(|parent| !parent.as_os_str().is_empty())
                    .map(Path::to_path_buf)
                    .unwrap_or_else(|| PathBuf::from("."));
                Ok((text, config_dir))
            }
            None => Ok((DEFAULT_MENU_TOML.to_string(), PathBuf::from(env!("CARGO_MANIFEST_DIR")))),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    #[test]
    fn loads_entries_from_an_explicit_file() {
        let dir = std::env::temp_dir().join(format!("staretz-cli-test-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("menu.toml");
        let mut file = std::fs::File::create(&path).unwrap();
        writeln!(
            file,
            r#"
            [[entry]]
            name = "Server"
            command = "pnpm dev"
            "#
        )
        .unwrap();

        let repository = TomlMenuRepository { path: Some(path) };
        let entries = repository.load().unwrap();

        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].name().as_str(), "Server");

        std::fs::remove_dir_all(&dir).unwrap();
    }

    #[test]
    fn falls_back_to_the_built_in_default_when_no_file_is_found() {
        let repository = TomlMenuRepository { path: None };
        let entries = repository.load().unwrap();

        assert!(!entries.is_empty());
    }
}
