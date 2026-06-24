# Staretz — AI Instructions

## Read docs before writing code

Before implementing any task, read the relevant docs in order:

1. `docs/architecture/overview.md` — layer boundaries and rules
2. The specific layer doc for the files you will touch
3. `docs/architecture/naming.md` — file and class naming
4. `docs/architecture/testing.md` — what tests are required
5. The relevant functional doc in `docs/functional/` if the task is feature work

Only read source files if the docs do not provide enough context. When in doubt, check the docs first — they describe patterns precisely enough to implement without reading existing code in most cases.

## After implementing a task

Update the relevant docs if anything changed: a new layer rule, a new naming pattern, a new feature.

## Project facts

- Flutter 3.44 / Dart 3.12 — web target, runs in Brave via `CHROME_EXECUTABLE=/usr/bin/brave-browser flutter run -d chrome`
- Local Flutter SDK: `~/development/flutter/bin/flutter`
- Tests: `flutter test` (unit + arch), `flutter test integration_test` (e2e)
- No comments in code unless the WHY is non-obvious
