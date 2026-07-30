use crate::domain::entities::menu::Menu;

pub struct SelectPreviousTabCommand;

#[derive(Default)]
pub struct SelectPreviousTabCommandHandler;

impl SelectPreviousTabCommandHandler {
    pub fn new() -> Self {
        SelectPreviousTabCommandHandler
    }

    pub fn handle(&self, menu: &mut Menu, _command: SelectPreviousTabCommand) {
        menu.select_previous();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_support::menu_entry_mother;

    #[test]
    fn wraps_to_the_last_tab_from_the_first() {
        let mut menu =
            Menu::create(vec![menu_entry_mother("Server"), menu_entry_mother("Tests")]).unwrap();

        SelectPreviousTabCommandHandler::new().handle(&mut menu, SelectPreviousTabCommand);

        assert_eq!(menu.selected_index(), 1);
    }
}
