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

**Tests must be updated in the same task.** Every feature addition or bug fix requires updating or adding the corresponding tests before the task is considered done. Leaving tests broken is not acceptable — if a change breaks existing tests, fix them as part of the same change.

## Project facts

This is a Dart monorepo. Read `docs/architecture/monorepo.md` first for the full picture.

| Package | Path | Language | Run command |
|---------|------|----------|-------------|
| `staretz_domain` | `packages/domain/` | Pure Dart | `dart test` |
| `staretz` (front) | `front/` | Flutter web | `flutter run -d web-server --web-port 5000 --dart-define=API_BASE_URL=http://localhost:8080` |
| `staretz_back` | `back/` | Dart Frog | `dart run dart_frog dev` |

- Flutter 3.44 / Dart 3.12
- Local Flutter SDK: `~/development/flutter/bin/flutter`
- Browser: Firefox on `http://localhost:5000` (Firefox does not support CDP so `-d chrome` cannot be used)
- Dashboard CMS is at `http://localhost:5000/dashboard` (same Flutter app, different route)
- Run all tests from root: `make test`
- No comments in code unless the WHY is non-obvious

## Front module structure

`front/lib/` has two feature modules:
- `blog/` — public read-only blog (Markdown assets, no backend required)
- `dashboard/` — CMS at `/dashboard`; reads/writes via the back-end REST API

## Shared domain rule

Domain entities, value objects, and repository ports live ONLY in `packages/domain/`. Never duplicate them in `front/` or `back/`. If a domain concept is needed across packages, add it to `packages/domain/` and import via `package:staretz_domain/...`.
