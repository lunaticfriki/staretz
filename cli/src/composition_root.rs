use std::sync::Arc;

use crate::application::menu_app_service::MenuAppService;
use crate::domain::entities::menu::Menu;
use crate::domain::ports::process_runner::ProcessRunner;
use crate::domain::ports::pty_runner::PtyRunner;
use crate::domain::repositories::menu_repository::MenuRepository;
use crate::infrastructure::pty_process_runner::PtyProcessRunner;
use crate::infrastructure::shell_process_runner::ShellProcessRunner;
use crate::infrastructure::toml_menu_repository::TomlMenuRepository;

/// The one place concrete infrastructure adapters are constructed and
/// wired into the application layer.
pub fn bootstrap() -> anyhow::Result<MenuAppService> {
    let repository = TomlMenuRepository::discover();
    let entries = repository.load()?;
    let menu = Menu::create(entries)?;
    let runner: Arc<dyn ProcessRunner> = Arc::new(ShellProcessRunner::new());
    let pty_runner: Arc<dyn PtyRunner> = Arc::new(PtyProcessRunner::new());
    Ok(MenuAppService::new(menu, runner, pty_runner))
}
