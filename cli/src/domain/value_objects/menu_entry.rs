use std::path::{Path, PathBuf};

use super::shell_command::ShellCommand;
use super::tab_name::TabName;

/// One configured tab: what to call it, what to run, where to run it, and
/// whether that program needs a real terminal to run — in which case it's
/// launched attached to a pseudo-terminal and rendered embedded in its own
/// pane, rather than as a line-oriented background job. `cwd` is always
/// absolute — resolving it relative to the config file's location is the
/// infrastructure ACL's job (see `infrastructure/acl/menu_entry_mapper.rs`),
/// not something this value object or its callers need to know about.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MenuEntry {
    name: TabName,
    command: ShellCommand,
    cwd: PathBuf,
    interactive: bool,
}

impl MenuEntry {
    pub fn create(name: TabName, command: ShellCommand, cwd: PathBuf, interactive: bool) -> Self {
        MenuEntry {
            name,
            command,
            cwd,
            interactive,
        }
    }

    pub fn name(&self) -> &TabName {
        &self.name
    }

    pub fn command(&self) -> &ShellCommand {
        &self.command
    }

    pub fn cwd(&self) -> &Path {
        &self.cwd
    }

    pub fn is_interactive(&self) -> bool {
        self.interactive
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exposes_its_fields_through_accessors() {
        let entry = MenuEntry::create(
            TabName::create("Claude").unwrap(),
            ShellCommand::create("claude").unwrap(),
            PathBuf::from("/repo"),
            true,
        );

        assert_eq!(entry.name().as_str(), "Claude");
        assert_eq!(entry.command().as_str(), "claude");
        assert_eq!(entry.cwd(), Path::new("/repo"));
        assert!(entry.is_interactive());
    }
}
