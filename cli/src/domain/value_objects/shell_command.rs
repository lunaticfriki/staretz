use std::fmt;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ShellCommand(String);

impl ShellCommand {
    pub fn create(value: impl Into<String>) -> Result<Self, EmptyShellCommandError> {
        let value = value.into();
        if value.trim().is_empty() {
            return Err(EmptyShellCommandError);
        }
        Ok(ShellCommand(value))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for ShellCommand {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
#[error("shell command must not be empty")]
pub struct EmptyShellCommandError;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_a_non_empty_command() {
        let command = ShellCommand::create("pnpm dev").unwrap();
        assert_eq!(command.as_str(), "pnpm dev");
    }

    #[test]
    fn rejects_an_empty_or_blank_command() {
        assert_eq!(ShellCommand::create(""), Err(EmptyShellCommandError));
        assert_eq!(ShellCommand::create("   "), Err(EmptyShellCommandError));
    }
}
