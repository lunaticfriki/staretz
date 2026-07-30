use std::sync::Arc;

use crate::application::docs_app_service::DocsAppService;
use crate::application::menu_app_service::MenuAppService;
use crate::domain::entities::menu::Menu;
use crate::domain::ports::process_runner::ProcessRunner;
use crate::domain::ports::pty_runner::PtyRunner;
use crate::domain::repositories::docs_repository::DocsRepository;
use crate::domain::repositories::menu_repository::MenuRepository;
use crate::infrastructure::fs_docs_repository::FsDocsRepository;
use crate::infrastructure::pty_process_runner::PtyProcessRunner;
use crate::infrastructure::shell_process_runner::ShellProcessRunner;
use crate::infrastructure::toml_menu_repository::TomlMenuRepository;

/// The one place concrete infrastructure adapters are constructed and
/// wired into the application layer.
pub fn bootstrap() -> anyhow::Result<(MenuAppService, DocsAppService)> {
    let repository = TomlMenuRepository::discover();
    let entries = repository.load()?;
    let menu = Menu::create(entries)?;
    let runner: Arc<dyn ProcessRunner> = Arc::new(ShellProcessRunner::new());
    let pty_runner: Arc<dyn PtyRunner> = Arc::new(PtyProcessRunner::new());
    let menu_service = MenuAppService::new(menu, runner, pty_runner);

    let docs_repository: Arc<dyn DocsRepository> = Arc::new(FsDocsRepository::discover());
    let docs_service = DocsAppService::new(docs_repository)?;

    Ok((menu_service, docs_service))
}
