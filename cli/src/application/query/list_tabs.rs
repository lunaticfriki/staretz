use crate::application::tab_read_model::TabReadModel;
use crate::domain::entities::menu::Menu;

pub struct ListTabsQuery;

#[derive(Default)]
pub struct ListTabsQueryHandler;

impl ListTabsQueryHandler {
    pub fn new() -> Self {
        ListTabsQueryHandler
    }

    pub fn handle(&self, menu: &Menu, _query: ListTabsQuery) -> Vec<TabReadModel> {
        menu.tabs().iter().map(TabReadModel::from_domain).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_support::menu_entry_mother;

    #[test]
    fn lists_every_tab_in_order() {
        let menu =
            Menu::create(vec![menu_entry_mother("Server"), menu_entry_mother("Tests")]).unwrap();

        let tabs = ListTabsQueryHandler::new().handle(&menu, ListTabsQuery);

        assert_eq!(tabs.iter().map(|t| t.name.clone()).collect::<Vec<_>>(), ["Server", "Tests"]);
    }
}
