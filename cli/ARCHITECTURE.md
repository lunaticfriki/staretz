# `cli/` Architecture

This crate follows the same Domain-Driven Design / Hexagonal Architecture
rules as the main app (see [`/docs`](../docs/README.md)), adapted for Rust.
Rust has no classes, no `interface`/`abstract class` distinction, and no
`readonly` field modifier, so several of the TypeScript-specific mechanics in
`/docs/01-06` don't transfer literally — this doc says what the Rust
equivalent is for each one, and why. If you're extending the CLI (adding a
new tab type, a new command, a new external service to call), read
[Adding a new command](#adding-a-new-command) first.

## Layers and the dependency rule

Exactly the same four layers, same rule: dependencies point inward only.

```
presentation ──depends on──▶ application ──depends on──▶ domain
                                   ▲
infrastructure ──implements ports declared in── domain
```

- **`domain/`** — zero outward dependencies (only `std` + `thiserror`, see
  [below](#thiserror-instead-of-a-domainerror-base-class)). Entities,
  value objects, a collection, the two ports, domain errors.
- **`application/`** — orchestrates domain objects. Depends only on domain.
  Commands, queries, a facade (`MenuAppService`) that owns the live state.
- **`infrastructure/`** — adapters implementing the domain's ports: reading
  `menu.toml`, running shell commands. Depends on domain only.
- **`presentation/`** — the `ratatui`/`crossterm` TUI. Depends on
  `application` (`MenuAppService`) only, never `infrastructure` directly.

```
src/
  domain/
    value_objects/   tab_name, shell_command, tab_id, process_status, menu_entry,
                      pty_size, terminal_snapshot
    collections/     output_log
    entities/        tab (entity), menu (aggregate root)
    repositories/     menu_repository (port: MenuRepository)
    ports/            process_runner (ports: ProcessRunner, RunningHandle),
                       pty_runner (ports: PtyRunner, PtyHandle)
    errors/           menu_error, tab_error
  application/
    command/          start_tab, stop_tab, select_next_tab, select_previous_tab,
                       sync_tabs, start_pty_tab, write_to_pty_tab, resize_pty_tab,
                       stop_pty_tab, sync_pty_tabs
    query/            list_tabs, get_selected_tab
    tab_read_model.rs
    menu_app_service.rs
  infrastructure/
    acl/              menu_entry_mapper (RawMenuEntry -> MenuEntry)
    toml_menu_repository.rs   (MenuRepository adapter)
    shell_process_runner.rs   (ProcessRunner/RunningHandle adapter)
    pty_process_runner.rs     (PtyRunner/PtyHandle adapter, portable-pty + vt100)
  presentation/
    tui.rs            terminal setup/restore, draw, event loop, pty pane rendering
  composition_root.rs  wires concrete adapters into MenuAppService
  lib.rs               module tree + `run()`
  main.rs               `fn main` calling `staretz_cli::run()`
  test_support.rs       Object Mothers, #[cfg(test)] only
```

## Deviations from `/docs`, and why

### Private field + accessor replaces "public readonly", for *every* field

The main docs say a field fixed at construction is `public readonly` in
TypeScript, and only a field mutated internally gets a private-field-plus-
accessor treatment. Rust has no `readonly` — a `pub` field is always
reassignable by any caller holding `&mut`, which would let external code
bypass a value object's `create()` validation entirely (construct it, then
just overwrite the field). So in this crate, **every** domain field is
private with a `pub fn` accessor, whether or not it ever changes after
construction (e.g. `MenuEntry::name()`, `Tab::id()`). This isn't the
TS-specific "getter-method anti-pattern" the docs warn against — in Rust,
private-field-plus-method is simply how encapsulation works; there is no
plainer alternative to fall back to.

### `thiserror` instead of a `DomainError` base class

TypeScript's `DomainError extends Error` gives every domain error a common
base type usable in `instanceof` checks. Rust has no inheritance. Every
domain/application error here derives `thiserror::Error` (which derives
`std::error::Error` + `Display`) instead — that trait is the idiomatic
Rust equivalent of "a typed, catchable error with a message." `thiserror`
is a compile-time proc-macro with no runtime footprint, which is why using
it in `domain/` doesn't violate "zero framework dependencies beyond a
minimal standard runtime."

### Ports are traits; `abstract class` becomes `trait` + `Box`/`Arc<dyn Trait>`

`MenuRepository` and `ProcessRunner`/`RunningHandle` (`domain/repositories/`,
`domain/ports/`) are plain Rust traits. Infrastructure adapters (
`TomlMenuRepository`, `ShellProcessRunner`) implement them. Application
handlers hold `Arc<dyn ProcessRunner>` the same way a TS handler holds an
injected `OrderRepository`.

### Command + handler share one file

The docs' TS convention is two files per command (`ConfirmOrder.command.ts`,
`ConfirmOrder.commandHandler.ts`), because TS tooling nudges toward one
export per file. Rust's module system doesn't have that pressure, so each
`application/command/*.rs` file holds both the `XCommand` struct and the
`XCommandHandler` — still two distinct types, just one file. Dots also
aren't valid in Rust filenames, so the `.commandHandler.ts`-style suffix
becomes a plain `_handler` module name where a second file is warranted
(there isn't one here).

### No repository for `Menu`/`Tab` — that state is never persisted

A repository port exists in the docs because something needs fetching from
outside the process (SQL, HTTP, a file). `Menu`'s tabs and their running
status have no such external form — they live for exactly as long as the
CLI process runs. So there's no `TabRepository`; `MenuAppService` just
owns a `Menu` value directly, constructed once at startup by
`composition_root::bootstrap()` from what `MenuRepository` (the config
loader) returns. The only two ports in this crate are the two genuine
boundaries to the outside world: reading `menu.toml`, and running shell
commands.

### One facade instead of read-service / write-service / state-service

The docs split a Preact module into three files specifically because
`@preact/signals-core` needs one dedicated place to hold reactive state,
separate from the pure read/write services so those stay portable and
signal-free. This CLI has no reactive-signals framework and doesn't need
one: the TUI redraws on an 80ms tick and just re-queries `MenuAppService`
each time, which is a polling equivalent of what a `Signal` auto-pushes in
Preact. Splitting further would mean holding the live `Menu` behind
`Rc<RefCell<_>>` so multiple service objects could share mutable access to
it, for no actual benefit — so `MenuAppService` merges all three roles: it
owns the state, and exposes both command and query operations, each still
implemented by delegating to a dedicated, individually unit-tested
command/query handler.

### `Tab` never holds its own process handle

It would be reasonable for `Tab` to hold a `Box<dyn RunningHandle>` — that
trait is domain-declared, so nothing outward would leak in. It's kept out
anyway, in `MenuAppService`'s `handles: HashMap<TabId, Box<dyn
RunningHandle>>`, so that domain entities stay plain data with pure
methods and never reach out to I/O themselves — only application handlers
talk to ports. `Tab::sync`-equivalent behavior is `SyncTabsCommandHandler`
pulling from the handle and feeding the result into `Tab`'s plain mutation
methods (`push_output`, `mark_exited`).

### `TerminalSnapshot` is plain data, not a `vt100::Screen`

Interactive tabs (`Claude`, `OpenCode`) run attached to a pseudo-terminal
and render embedded in their own pane, instead of taking over the whole
screen. The infrastructure adapter (`pty_process_runner.rs`) uses
`portable-pty` to spawn into a pty and `vt100` as the terminal emulator
that turns its raw output into a grid of styled cells. That grid is
domain-declared (`TerminalSnapshot`/`TerminalCell`/`TerminalColor` in
`domain/value_objects/terminal_snapshot.rs`) rather than the `vt100`
crate's own `Screen` type, so no terminal-emulation crate leaks past the
`PtyRunner` port — `presentation/tui.rs` turns a `TerminalSnapshot` into
`ratatui` spans itself, the same way it already turns other read models
into widgets, instead of depending on a third-party terminal-widget crate.

### Tests: inline `#[cfg(test)] mod tests`, not a co-located `__tests__/` folder

Same principle (tests co-located with what they test), idiomatic Rust
mechanism: a `#[cfg(test)] mod tests` block at the bottom of the same file,
which is the tightest co-location possible. Object Mothers
(`menu_entry_mother`, `interactive_menu_entry_mother`) live in one shared
`src/test_support.rs`, `#[cfg(test)]`-gated in `lib.rs`, rather than one
file per entity — any test module in the crate can reach it via
`crate::test_support::...`, which doesn't require the per-file export
`ts-mockito`/Object-Mother convention was working around.

### Fakes instead of a mocking library

Application tests hand-roll a small struct implementing the port trait
(`FakeRunner`, `FakeHandle` in `start_tab.rs`'s test module) rather than
using a mocking library like `ts-mockito`. This is the idiomatic Rust
choice at this scale — trait objects make hand-rolled fakes trivial to
write, and there's no equivalent ubiquitous mocking convention to reach
for instead.

### No arch-test automation yet

The main app enforces the dependency rule in CI via `dependency-cruiser`.
This crate has no equivalent automated check yet — the boundary is only as
strong as code review. If a future change makes this worth enforcing
(e.g. more contributors), a `cargo test` that greps `domain/**/*.rs` for
`use crate::application` / `use crate::infrastructure` / `use
crate::presentation` and fails the build on a match would be a reasonable
lightweight equivalent.

### Presentation is not unit-tested

Same rule as the main app: `presentation/tui.rs` has no `#[cfg(test)]`
tests. It's verified by manually driving the TUI end-to-end in a real
terminal (a `tmux` session sending real keystrokes and asserting on
`tmux capture-pane` output) — this crate's equivalent of the main app's
Playwright/Cucumber E2E suite, just without an automated harness for it
yet.

## Testing strategy, concretely

- **Domain** (`domain/**/*.rs`): no fakes, no mocks — construct values via
  Object Mothers or `::create()` directly, assert on resulting state or a
  returned domain error.
- **Application** (`application/**/*.rs`): fake the two ports
  (`ProcessRunner`/`RunningHandle`, occasionally `MenuRepository`) with a
  hand-rolled struct in the test module; assert on the resulting `Menu`/
  `Tab` state and on interactions with the fake (e.g. "was `kill` called").
- **Infrastructure** (`infrastructure/**/*.rs`): tested against the real
  thing — `shell_process_runner.rs`'s tests actually spawn `sh`/`echo`/
  `sleep` and check real process behavior (including that `kill` reaps the
  whole process group); `toml_menu_repository.rs`'s tests read a real
  temp file.
- **Presentation**: not unit-tested; verified manually (see above).

Run everything with `cargo test` from `cli/`.

## Adding a new command

Say you want a new action beyond run/stop/switch-tabs — e.g. "restart the
selected tab" or a new kind of external call. The seams to use, in order:

1. If it's a new capability the domain doesn't have yet (not just a new
   combination of existing ones), add a port trait method to
   `domain/ports/process_runner.rs` (or a new port file, if it's a
   genuinely different capability) — implement it in
   `infrastructure/shell_process_runner.rs` (or a new adapter file).
2. Add `application/command/restart_tab.rs`: a `RestartTabCommand` struct
   and a `RestartTabCommandHandler` that takes whatever ports it needs in
   `new()`, and a `handle(&self, menu: &mut Menu, ..., command: ...)`
   method that looks up the `Tab`, calls domain/port methods, and returns a
   typed error enum if it can fail in more than one way.
3. Register the handler as a field on `MenuAppService`, constructed in
   `MenuAppService::new`, and add a public method (`restart_selected()`)
   that resolves the selected `TabId` and delegates to it — this is the one
   new thing `presentation/tui.rs` gets to call.
4. Wire a key in `presentation/tui.rs`'s `event_loop` match arm.
5. Add `#[cfg(test)] mod tests` to the new command file with a fake port,
   following the pattern in `start_tab.rs`.
