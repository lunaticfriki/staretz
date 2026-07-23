# Git Workflow & Husky

Two hooks, wired through Husky:

- **`prepare-commit-msg`**: fires on every `git commit`. Prompts for a
  conventional-commit `type` (feat, fix, docs, style, refactor, perf, test,
  build, ci, chore, revert), an optional scope, and a short description, then
  writes the resulting `type(scope): description` into the commit message
  file before Git proceeds. This is triggered by plain `git commit` (or a
  `git commit` alias) — there is no `pnpm`/wrapper script developers need to
  remember to run.
- **`pre-push`**: stashes any uncommitted work (staged, unstaged, and
  untracked), runs the test suite against exactly what's committed, then
  restores the stash regardless of whether the tests passed — so the push is
  blocked on a failure without ever losing in-progress, uncommitted work.

Ready-to-copy templates live in `templates/`:

```
templates/
  husky/
    pre-push
    prepare-commit-msg
  scripts/
    commit.mjs
    pre-push-tests.sh
  commitlint.config.cjs
```

## Why a git hook instead of a package.json script

An earlier iteration of this setup exposed the interactive commit prompt as
a `pnpm commit` script. That works, but only if the developer remembers to
type `pnpm commit` instead of `git commit`/`git cm`/their editor's commit
button — and IDEs, GUI git clients, and muscle memory all reach for plain
`git commit`. Wiring the prompt into `prepare-commit-msg` means it fires
however the commit is triggered from a real terminal, with zero extra steps
to remember. `git commit -m "..."` and IDE-driven commits still work exactly
as before — see "When the prompt does *not* appear" below.

## Why stash before testing

If the test suite (or a build step it depends on) reads from the working
tree rather than strictly from `git show HEAD`, uncommitted changes can
silently affect what gets tested — a fix might pass locally only because of
an uncommitted tweak that never makes it into the pushed commits. Stashing
before running tests guarantees the working tree matches `HEAD` exactly
while tests run, so a green pre-push check means "what's about to be pushed
passes," not "my working tree currently passes." The stash is always
restored afterward — on success, on failure, and if the script is
interrupted — via a shell `trap`.

## Setup

```bash
pnpm add -D husky @commitlint/cli @commitlint/config-conventional
pnpm dlx husky init
```

Husky's `init` creates a default `.husky/pre-commit` running `pnpm test` —
delete it, this workflow only gates on push, not on every commit:

```bash
rm .husky/pre-commit
```

Copy the templates in:

```bash
cp templates/scripts/commit.mjs scripts/commit.mjs
cp templates/scripts/pre-push-tests.sh scripts/pre-push-tests.sh
cp templates/commitlint.config.cjs commitlint.config.cjs
chmod +x scripts/pre-push-tests.sh

cp templates/husky/pre-push .husky/pre-push
cp templates/husky/prepare-commit-msg .husky/prepare-commit-msg
chmod +x .husky/pre-push .husky/prepare-commit-msg
```

Add a `commit-msg` hook so commitlint validates the format even when someone
bypasses the prompt (see below):

```bash
echo 'pnpm exec commitlint --edit "$1"' > .husky/commit-msg
chmod +x .husky/commit-msg
```

`pre-push-tests.sh` defaults `TEST_CMD` to `pnpm test` — update that
variable at the top of the script if the project's real test command
differs.

Recommended: alias `git commit` so it doesn't stop to open an editor after
the hook has already written the message (Git only skips the editor when
told to):

```bash
git config alias.cm "commit --no-edit"
```

With this in place, `git commit` or `git cm` in a real terminal shows the
type/scope/description prompt and finishes the commit immediately — no
editor, no `pnpm` step.

## When the prompt does *not* appear

The hook intentionally stays out of the way in a few cases — it inspects the
commit source Git passes as its second argument, and the TTY on its stdin:

- `git commit -m "..."` / `-F file` (source = `message`) — a message was
  already given explicitly; the hook leaves it untouched.
- Merges, squashes, `--amend`/`-C` reusing an existing message (source =
  `merge` / `squash` / `commit`) — there's already a message to reuse or
  merge-specific content to preserve.
- No real terminal on stdin (source editors, IDE commit panels, CI) — the
  hook silently exits and Git falls back to its normal behavior (opening the
  configured editor, or using whatever message was supplied).

In every skipped case, the `commit-msg` hook (commitlint) still validates
whatever message ends up being used — bypassing the prompt does not bypass
the format check.

## Commit types

| type       | when                                                          |
|------------|----------------------------------------------------------------|
| `feat`     | a new feature                                                   |
| `fix`      | a bug fix                                                       |
| `docs`     | documentation only                                              |
| `style`    | formatting, whitespace — no code meaning change                 |
| `refactor` | code change that neither fixes a bug nor adds a feature         |
| `perf`     | performance improvement                                         |
| `test`     | adding or correcting tests                                      |
| `build`    | build system or external dependency changes                     |
| `ci`       | CI configuration changes                                        |
| `chore`    | anything else that doesn't touch `src`/`lib` or tests           |
| `revert`   | reverts a previous commit                                       |

## What the pre-push hook does, step by step

1. Check for uncommitted changes (staged, unstaged, or untracked).
2. If any exist, `git stash push --include-untracked` them.
3. Run the project's test command against the now-clean working tree
   (matching `HEAD`, i.e. exactly what's about to be pushed).
4. Restore the stash unconditionally (`trap ... EXIT`), whether tests passed,
   failed, or the script was interrupted.
5. Exit non-zero on test failure, which aborts the push; exit zero on
   success, which lets the push proceed.

See `templates/scripts/pre-push-tests.sh` for the implementation.
