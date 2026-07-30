use super::tab_name::TabName;

/// Identity of a `Tab`, derived from its `TabName`. Menu names must be
/// unique within a `Menu` (enforced by `Menu::create`), which is what makes
/// this a valid identity rather than just a copy of the display name.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct TabId(String);

impl TabId {
    pub fn from_name(name: &TabName) -> Self {
        TabId(name.as_str().to_string())
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn is_derived_from_the_tab_name() {
        let name = TabName::create("Server").unwrap();
        assert_eq!(TabId::from_name(&name).as_str(), "Server");
    }
}
