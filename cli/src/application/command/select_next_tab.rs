use crate::domain::entities::menu::Menu;

pub struct SelectNextTabCommand;

#[derive(Default)]
pub struct SelectNextTabCommandHandler;

impl SelectNextTabCommandHandler {
    pub fn new() -> Self {
        SelectNextTabCommandHandler
    }

    pub fn handle(&self, menu: &mut Menu, _command: SelectNextTabCommand) {
        menu.select_next();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_support::menu_entry_mother;

    #[test]
    fn advances_the_selection() {
        let mut menu =
            Menu::create(vec![menu_entry_mother("Server"), menu_entry_mother("Tests")]).unwrap();

        SelectNextTabCommandHandler::new().handle(&mut menu, SelectNextTabCommand);

        assert_eq!(menu.selected_index(), 1);
    }
}
