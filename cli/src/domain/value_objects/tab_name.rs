use std::fmt;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct TabName(String);

impl TabName {
    pub fn create(value: impl Into<String>) -> Result<Self, EmptyTabNameError> {
        let value = value.into();
        if value.trim().is_empty() {
            return Err(EmptyTabNameError);
        }
        Ok(TabName(value))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for TabName {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
#[error("tab name must not be empty")]
pub struct EmptyTabNameError;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_a_non_empty_name() {
        let name = TabName::create("Server").unwrap();
        assert_eq!(name.as_str(), "Server");
    }

    #[test]
    fn rejects_an_empty_or_blank_name() {
        assert_eq!(TabName::create(""), Err(EmptyTabNameError));
        assert_eq!(TabName::create("   "), Err(EmptyTabNameError));
    }
}
