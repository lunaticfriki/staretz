use std::collections::HashSet;

use super::tab::Tab;
use crate::domain::errors::menu_error::{DuplicateTabNameError, EmptyMenuError, MenuError};
use crate::domain::value_objects::menu_entry::MenuEntry;
use crate::domain::value_objects::tab_id::TabId;

/// Aggregate root owning every configured tab and which one is currently
/// selected. `selected` is guaranteed to always be a valid index once a
/// `Menu` exists — `create` requires at least one entry, and
/// `select_next`/`select_previous` wrap around — so there is no invalid
/// "no selection" state to represent or guard against elsewhere.
pub struct Menu {
    tabs: Vec<Tab>,
    selected: usize,
}

impl Menu {
    pub fn create(entries: Vec<MenuEntry>) -> Result<Self, MenuError> {
        if entries.is_empty() {
            return Err(EmptyMenuError.into());
        }

        let mut seen_names = HashSet::new();
        for entry in &entries {
            if !seen_names.insert(entry.name().clone()) {
                return Err(DuplicateTabNameError::new(entry.name()).into());
            }
        }

        Ok(Menu {
            tabs: entries.into_iter().map(Tab::create).collect(),
            selected: 0,
        })
    }

    pub fn tabs(&self) -> &[Tab] {
        &self.tabs
    }

    pub fn tabs_mut(&mut self) -> &mut [Tab] {
        &mut self.tabs
    }

    pub fn tab_mut(&mut self, id: &TabId) -> Option<&mut Tab> {
        self.tabs.iter_mut().find(|tab| tab.id() == id)
    }

    pub fn selected_index(&self) -> usize {
        self.selected
    }

    pub fn selected(&self) -> &Tab {
        &self.tabs[self.selected]
    }

    pub fn select_next(&mut self) {
        self.selected = (self.selected + 1) % self.tabs.len();
    }

    pub fn select_previous(&mut self) {
        self.selected = (self.selected + self.tabs.len() - 1) % self.tabs.len();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_support::menu_entry_mother;

    #[test]
    fn rejects_an_empty_set_of_entries() {
        let result = Menu::create(vec![]);
        assert!(matches!(result, Err(MenuError::Empty(_))));
    }

    #[test]
    fn rejects_duplicate_tab_names() {
        let result = Menu::create(vec![
            menu_entry_mother("Server"),
            menu_entry_mother("Server"),
        ]);
        assert!(matches!(result, Err(MenuError::DuplicateName(_))));
    }

    #[test]
    fn starts_with_the_first_entry_selected() {
        let menu = Menu::create(vec![menu_entry_mother("Server"), menu_entry_mother("Tests")]).unwrap();
        assert_eq!(menu.selected_index(), 0);
        assert_eq!(menu.selected().id().as_str(), "Server");
    }

    #[test]
    fn select_next_and_previous_wrap_around() {
        let mut menu =
            Menu::create(vec![menu_entry_mother("Server"), menu_entry_mother("Tests")]).unwrap();

        menu.select_next();
        assert_eq!(menu.selected_index(), 1);

        menu.select_next();
        assert_eq!(menu.selected_index(), 0, "should wrap back to the first tab");

        menu.select_previous();
        assert_eq!(menu.selected_index(), 1, "should wrap back to the last tab");
    }
}
