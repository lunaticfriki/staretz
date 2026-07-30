use std::collections::HashMap;
use std::sync::Arc;

use crate::domain::entities::menu::Menu;
use crate::domain::errors::tab_error::TabNotFoundError;
use crate::domain::ports::process_runner::{ProcessRunner, RunningHandle};
use crate::domain::ports::pty_runner::{PtyHandle, PtyRunner};
use crate::domain::value_objects::pty_size::PtySize;
use crate::domain::value_objects::tab_id::TabId;

use super::command::resize_pty_tab::{ResizePtyTabCommand, ResizePtyTabCommandHandler};
use super::command::select_next_tab::{SelectNextTabCommand, SelectNextTabCommandHandler};
use super::command::select_previous_tab::{SelectPreviousTabCommand, SelectPreviousTabCommandHandler};
use super::command::start_pty_tab::{StartPtyTabCommand, StartPtyTabCommandHandler, StartPtyTabError};
use super::command::start_tab::{StartTabCommand, StartTabCommandHandler, StartTabError};
use super::command::stop_pty_tab::{StopPtyTabCommand, StopPtyTabCommandHandler};
use super::command::stop_tab::{StopTabCommand, StopTabCommandHandler};
use super::command::sync_pty_tabs::{SyncPtyTabsCommand, SyncPtyTabsCommandHandler};
use super::command::sync_tabs::{SyncTabsCommand, SyncTabsCommandHandler};
use super::command::write_to_pty_tab::{WriteToPtyTabCommand, WriteToPtyTabCommandHandler};
use super::query::get_selected_tab::{GetSelectedTabQuery, GetSelectedTabQueryHandler};
use super::query::list_tabs::{ListTabsQuery, ListTabsQueryHandler};
use super::tab_read_model::TabReadModel;

/// Single entry point presentation depends on. It owns the live `Menu`
/// state and the handles to whatever background/pty processes are
/// currently running, and delegates every operation to the appropriate
/// command/query handler — playing the role the Preact app's
/// `*.stateService.ts` plays (see [03-application-layer-cqrs.md] in the
/// main docs), minus a reactive Signal: there's no framework to auto-push
/// updates to, so presentation just re-queries after each `sync()` tick.
pub struct MenuAppService {
    menu: Menu,
    handles: HashMap<TabId, Box<dyn RunningHandle>>,
    pty_handles: HashMap<TabId, Box<dyn PtyHandle>>,

    start_tab: StartTabCommandHandler,
    stop_tab: StopTabCommandHandler,
    select_next_tab: SelectNextTabCommandHandler,
    select_previous_tab: SelectPreviousTabCommandHandler,
    sync_tabs: SyncTabsCommandHandler,
    start_pty_tab: StartPtyTabCommandHandler,
    write_to_pty_tab: WriteToPtyTabCommandHandler,
    resize_pty_tab: ResizePtyTabCommandHandler,
    stop_pty_tab: StopPtyTabCommandHandler,
    sync_pty_tabs: SyncPtyTabsCommandHandler,
    list_tabs: ListTabsQueryHandler,
    get_selected_tab: GetSelectedTabQueryHandler,
}

impl MenuAppService {
    pub fn new(menu: Menu, runner: Arc<dyn ProcessRunner>, pty_runner: Arc<dyn PtyRunner>) -> Self {
        MenuAppService {
            menu,
            handles: HashMap::new(),
            pty_handles: HashMap::new(),
            start_tab: StartTabCommandHandler::new(runner),
            stop_tab: StopTabCommandHandler::new(),
            select_next_tab: SelectNextTabCommandHandler::new(),
            select_previous_tab: SelectPreviousTabCommandHandler::new(),
            sync_tabs: SyncTabsCommandHandler::new(),
            start_pty_tab: StartPtyTabCommandHandler::new(pty_runner),
            write_to_pty_tab: WriteToPtyTabCommandHandler::new(),
            resize_pty_tab: ResizePtyTabCommandHandler::new(),
            stop_pty_tab: StopPtyTabCommandHandler::new(),
            sync_pty_tabs: SyncPtyTabsCommandHandler::new(),
            list_tabs: ListTabsQueryHandler::new(),
            get_selected_tab: GetSelectedTabQueryHandler::new(),
        }
    }

    pub fn tabs(&self) -> Vec<TabReadModel> {
        self.list_tabs.handle(&self.menu, ListTabsQuery)
    }

    pub fn selected_index(&self) -> usize {
        self.menu.selected_index()
    }

    pub fn selected(&self) -> TabReadModel {
        self.get_selected_tab.handle(&self.menu, GetSelectedTabQuery)
    }

    pub fn selected_is_interactive(&self) -> bool {
        self.menu.selected().is_interactive()
    }

    pub fn select_next(&mut self) {
        self.select_next_tab.handle(&mut self.menu, SelectNextTabCommand);
    }

    pub fn select_previous(&mut self) {
        self.select_previous_tab
            .handle(&mut self.menu, SelectPreviousTabCommand);
    }

    pub fn start_selected(&mut self) -> Result<(), StartTabError> {
        let tab_id = self.menu.selected().id().clone();
        self.start_tab
            .handle(&mut self.menu, &mut self.handles, StartTabCommand { tab_id })
    }

    /// Starts (or, if already running, leaves untouched) the selected
    /// interactive tab's pty, sized to fit the pane presentation drew.
    pub fn start_selected_pty(&mut self, size: PtySize) -> Result<(), StartPtyTabError> {
        let tab_id = self.menu.selected().id().clone();
        self.start_pty_tab
            .handle(&mut self.menu, &mut self.pty_handles, StartPtyTabCommand { tab_id, size })
    }

    pub fn write_to_selected_pty(&mut self, bytes: Vec<u8>) {
        let tab_id = self.menu.selected().id().clone();
        self.write_to_pty_tab
            .handle(&mut self.pty_handles, WriteToPtyTabCommand { tab_id, bytes });
    }

    pub fn resize_selected_pty(&mut self, size: PtySize) {
        let tab_id = self.menu.selected().id().clone();
        self.resize_pty_tab
            .handle(&mut self.pty_handles, ResizePtyTabCommand { tab_id, size });
    }

    pub fn stop_selected(&mut self) -> Result<(), TabNotFoundError> {
        let tab_id = self.menu.selected().id().clone();
        if self.menu.selected().is_interactive() {
            self.stop_pty_tab
                .handle(&mut self.menu, &mut self.pty_handles, StopPtyTabCommand { tab_id })
        } else {
            self.stop_tab
                .handle(&mut self.menu, &mut self.handles, StopTabCommand { tab_id })
        }
    }

    pub fn stop_all(&mut self) {
        let ids: Vec<(TabId, bool)> = self
            .menu
            .tabs()
            .iter()
            .map(|tab| (tab.id().clone(), tab.is_interactive()))
            .collect();
        for (tab_id, interactive) in ids {
            if interactive {
                let _ = self
                    .stop_pty_tab
                    .handle(&mut self.menu, &mut self.pty_handles, StopPtyTabCommand { tab_id });
            } else {
                let _ = self
                    .stop_tab
                    .handle(&mut self.menu, &mut self.handles, StopTabCommand { tab_id });
            }
        }
    }

    pub fn sync(&mut self) {
        self.sync_tabs
            .handle(&mut self.menu, &mut self.handles, SyncTabsCommand);
        self.sync_pty_tabs
            .handle(&mut self.menu, &mut self.pty_handles, SyncPtyTabsCommand);
    }
}
