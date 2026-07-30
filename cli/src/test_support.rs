//! Object Mothers shared across domain and application tests. Only ever
//! imported from `#[cfg(test)]` code, never from production code.
use std::path::PathBuf;

use crate::domain::value_objects::menu_entry::MenuEntry;
use crate::domain::value_objects::shell_command::ShellCommand;
use crate::domain::value_objects::tab_name::TabName;

pub fn menu_entry_mother(name: &str) -> MenuEntry {
    MenuEntry::create(
        TabName::create(name).unwrap(),
        ShellCommand::create("true").unwrap(),
        PathBuf::from("."),
        false,
    )
}

pub fn interactive_menu_entry_mother(name: &str) -> MenuEntry {
    MenuEntry::create(
        TabName::create(name).unwrap(),
        ShellCommand::create("true").unwrap(),
        PathBuf::from("."),
        true,
    )
}
