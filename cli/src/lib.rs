pub mod application;
pub mod composition_root;
pub mod domain;
pub mod infrastructure;
pub mod presentation;

#[cfg(test)]
pub(crate) mod test_support;

pub fn run() -> anyhow::Result<()> {
    let service = composition_root::bootstrap()?;
    presentation::tui::run(service)
}
