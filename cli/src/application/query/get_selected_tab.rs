use crate::application::tab_read_model::TabReadModel;
use crate::domain::entities::menu::Menu;

pub struct GetSelectedTabQuery;

#[derive(Default)]
pub struct GetSelectedTabQueryHandler;

impl GetSelectedTabQueryHandler {
    pub fn new() -> Self {
        GetSelectedTabQueryHandler
    }

    pub fn handle(&self, menu: &Menu, _query: GetSelectedTabQuery) -> TabReadModel {
        TabReadModel::from_domain(menu.selected())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_support::menu_entry_mother;

    #[test]
    fn returns_the_currently_selected_tab() {
        let mut menu =
            Menu::create(vec![menu_entry_mother("Server"), menu_entry_mother("Tests")]).unwrap();
        menu.select_next();

        let selected = GetSelectedTabQueryHandler::new().handle(&menu, GetSelectedTabQuery);

        assert_eq!(selected.name, "Tests");
    }
}
