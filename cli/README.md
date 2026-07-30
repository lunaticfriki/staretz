# staretz-cli — user manual

A small Rust TUI (`ratatui` + `crossterm`) that puts the project's common
dev commands — an empty terminal, server, test watchers, `claude`,
`opencode` — behind a single terminal window with a horizontal tab bar, so
you don't have to remember or retype them, or juggle several terminal tabs
by hand.

For how the crate is built internally (layers, adding a new command), see
[ARCHITECTURE.md](ARCHITECTURE.md). This document is only about using it.

## Running it

```sh
cd cli && cargo run
```

## Configuring tabs

Tabs are read from [`menu.toml`](menu.toml) at startup. Each `[[entry]]`
becomes one tab:

```toml
[[entry]]
name = "Claude"
command = "claude"
cwd = ".."
interactive = true
```

- `command` runs through the shell, with `cwd` resolved relative to the
  repo root (the parent of `cli/`).
- `interactive = true` marks a tab whose command is a full-screen program
  (`claude`, `opencode`) or otherwise needs a real terminal to prompt for
  input. These run attached to a pseudo-terminal (pty) and render embedded
  in the tab's pane, instead of just streaming output. Omit it (or set
  `false`) for a command that only prints output, like a dev server or a
  test watcher in watch mode.

### The `Terminal` tab

The first tab is a plain, empty shell (`$SHELL`) with no fixed command —
useful for one-off commands you don't want to leave the TUI for. It's
marked `interactive = true` for the same reason `Claude`/`OpenCode` are:
a shell needs a real TTY to prompt for input.

### The `Git` tab

`Git` runs [`scripts/git-menu.sh`](../scripts/git-menu.sh), a small text
menu (status / diff / commit / push / pull / log) instead of a raw shell.
It's marked `interactive = true` because `commit` and `push` need a real
TTY — they trigger this repo's husky hooks (`prepare-commit-msg`,
`commit-msg`, `pre-push`, see the root [README](../README.md#git-workflow)),
which prompt interactively and would silently no-op without one.

## Two focus modes

The TUI has two places your keystrokes can go, shown in the status line at
the bottom:

- **Tab bar** (default) — keys navigate/act on tabs. This is where you
  land on startup and whenever you detach from a running program.
- **Pty pane** — after pressing `Enter` on an *interactive* tab, every
  keystroke is forwarded straight into that program (so `claude`/`opencode`
  see your input exactly as if you'd typed it into a normal terminal),
  except the one detach key below.

## Keybindings

### Tab bar focus

| Key              | Action                                              |
| ---------------- | ---------------------------------------------------- |
| `Tab` / `→` / `l` | Select next tab                                     |
| `Shift+Tab` / `←` / `h` | Select previous tab                           |
| `Enter`          | Run the selected tab's command — for an `interactive` tab, this also switches focus to the pty pane |
| `↓` / `j`        | Scroll the selected tab's output down (non-interactive tabs) |
| `↑` / `K`        | Scroll the selected tab's output up (non-interactive tabs) |
| `k`              | Stop the selected tab's running process             |
| `q` / `Ctrl+C`   | Quit the whole app (stops every running process first) |

### Pty pane focus (inside `claude` / `opencode`)

| Key      | Action                                                                 |
| -------- | ----------------------------------------------------------------------- |
| `Ctrl+o` | Detach back to the tab bar. The program keeps running untouched — nothing is stopped. |
| anything else | Forwarded to the program running in the pane, as if typed into a real terminal |

To switch from `claude` to `opencode` (or any other tab) without killing
what's running: `Ctrl+o` to detach, then `Tab`/`←`/`→` to pick the other
tab, then `Enter` to focus it. Your original tab's process is untouched
and still running in the background — detach back into it the same way at
any time.

Note: detaching only happens via `Ctrl+o`. If the process behind an
interactive tab exits on its own (e.g. you quit `claude` from inside it),
focus automatically returns to the tab bar.
