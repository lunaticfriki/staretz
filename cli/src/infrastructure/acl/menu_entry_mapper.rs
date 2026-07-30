use std::path::Path;

use serde::Deserialize;

use crate::domain::repositories::menu_repository::MenuLoadError;
use crate::domain::value_objects::menu_entry::MenuEntry;
use crate::domain::value_objects::shell_command::ShellCommand;
use crate::domain::value_objects::tab_name::TabName;

/// The wire shape read straight out of `menu.toml`.
#[derive(Debug, Deserialize)]
pub struct RawMenuEntry {
    pub name: String,
    pub command: String,
    #[serde(default)]
    pub cwd: Option<String>,
    #[serde(default)]
    pub interactive: bool,
}

pub struct MenuEntryMapper;

impl MenuEntryMapper {
    /// Translates one raw TOML entry into a domain `MenuEntry`, resolving
    /// `cwd` to an absolute path relative to the config file's own
    /// directory — a filesystem detail the domain shouldn't have to know
    /// about.
    pub fn to_domain(raw: RawMenuEntry, config_dir: &Path) -> Result<MenuEntry, MenuLoadError> {
        let name = TabName::create(raw.name).map_err(|err| MenuLoadError::new(err.to_string()))?;
        let command =
            ShellCommand::create(raw.command).map_err(|err| MenuLoadError::new(err.to_string()))?;
        let cwd = config_dir.join(raw.cwd.as_deref().unwrap_or("."));
        Ok(MenuEntry::create(name, command, cwd, raw.interactive))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    #[test]
    fn resolves_cwd_relative_to_the_config_directory() {
        let raw = RawMenuEntry {
            name: "Server".into(),
            command: "pnpm dev".into(),
            cwd: Some("..".into()),
            interactive: false,
        };

        let entry = MenuEntryMapper::to_domain(raw, Path::new("/repo/cli")).unwrap();

        assert_eq!(entry.cwd(), PathBuf::from("/repo/cli/.."));
        assert!(!entry.is_interactive());
    }

    #[test]
    fn defaults_cwd_to_the_config_directory_itself() {
        let raw = RawMenuEntry {
            name: "Claude".into(),
            command: "claude".into(),
            cwd: None,
            interactive: true,
        };

        let entry = MenuEntryMapper::to_domain(raw, Path::new("/repo/cli")).unwrap();

        assert_eq!(entry.cwd(), PathBuf::from("/repo/cli/."));
        assert!(entry.is_interactive());
    }

    #[test]
    fn rejects_an_empty_name() {
        let raw = RawMenuEntry {
            name: "".into(),
            command: "pnpm dev".into(),
            cwd: None,
            interactive: false,
        };

        assert!(MenuEntryMapper::to_domain(raw, Path::new("/repo/cli")).is_err());
    }
}
