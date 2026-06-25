# Monorepo Structure

## Packages

```
staretz/
  packages/
    domain/          # Pure Dart — shared domain layer (no Flutter)
  front/             # Flutter web — public blog
  back/              # Dart Frog — REST API + PostgreSQL
  dashboard/         # Flutter web — private CMS (Google auth)
```

## Dependency graph

```
front  ──┐
back   ──┤──→  packages/domain
dashboard┘
```

All three apps declare `staretz_domain` as a path dependency. The domain package has no Flutter dependency, making it usable by the Dart Frog backend.

## packages/domain (`staretz_domain`)

Pure Dart package. Contains:
- `lib/blog/domain/` — Post entity, value objects, PostRepository port
- `lib/shared/domain/` — AppTheme, ThemeRepository port
- `lib/shared/pagination/` — PageCriteria, Paginated

**Rule:** No `flutter` imports allowed anywhere in this package (enforced by `test/arch/domain_arch_test.dart`).

Run tests: `dart test` from `packages/domain/`.

## front (`staretz`)

Flutter web app. The public-facing blog. Read-only — uses `MarkdownPostRepository` which bundles post files as assets.

Run: `flutter run -d web-server --web-port 5000` from `front/`.
Test: `flutter test` from `front/`.

## back (`staretz_back`)

Dart Frog REST API. Requires a running PostgreSQL instance.

Routes:
- `GET /posts` — paginated post list
- `GET /posts/:slug` — single post
- `POST /posts` — create/update post (dashboard only)
- `DELETE /posts/:slug` — delete post (dashboard only)

Database setup: run `back/migrate.sql` against your PostgreSQL instance.

Environment variables:
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `staretz` | Database name |
| `DB_USER` | `staretz` | Database user |
| `DB_PASSWORD` | `` | Database password |

Run: `dart_frog dev` from `back/`.
Test: `dart test` from `back/`.

## dashboard (`staretz_dashboard`)

Flutter web app. Private CMS for creating and editing posts. Protected by Google Sign-In.

Configure the API base URL via the `API_BASE_URL` compile-time constant (defaults to `http://localhost:8080`).

Run: `flutter run -d web-server --web-port 5001 --dart-define=API_BASE_URL=http://localhost:8080` from `dashboard/`.
Test: `flutter test` from `dashboard/`.

## Commands

All commands are available from the repo root via `make`. See `Makefile` for details.
