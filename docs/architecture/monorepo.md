# Monorepo Structure

## Packages

```
staretz/
  packages/
    domain/          # Pure Dart — shared domain layer (no Flutter)
  front/             # Flutter web — public blog + CMS dashboard
  back/              # Dart Frog — REST API + PostgreSQL
```

## Dependency graph

```
front  ──┐
back   ──┴──→  packages/domain
```

Both apps declare `staretz_domain` as a path dependency. The domain package has no Flutter dependency, making it usable by the Dart Frog backend.

## packages/domain (`staretz_domain`)

Pure Dart package. Contains:
- `lib/blog/domain/` — Post entity, value objects, PostRepository port
- `lib/shared/domain/` — AppTheme, ThemeRepository port
- `lib/shared/pagination/` — PageCriteria, Paginated

**Rule:** No `flutter` imports allowed anywhere in this package (enforced by `test/arch/domain_arch_test.dart`).

Run tests: `dart test` from `packages/domain/`.

## front (`staretz`)

Flutter web app. Two feature modules served from the same process on port 5000:

| Module | Path | Routes | Description |
|--------|------|--------|-------------|
| `blog` | `lib/blog/` | `/`, `/blog`, `/blog/:slug` | Public read-only blog; reads from bundled Markdown assets |
| `dashboard` | `lib/dashboard/` | `/dashboard`, `/dashboard/new`, `/dashboard/:slug/edit` | CMS for creating and editing posts; talks to the back-end API |

The `dashboard` module is currently public (no auth). Authentication will be added later as a route guard.

Configure the back-end URL via the `API_BASE_URL` compile-time constant (default: `http://localhost:8080`).

Run: `flutter run -d web-server --web-port 5000 --dart-define=API_BASE_URL=http://localhost:8080` from `front/`.
Test: `flutter test` from `front/`.

## back (`staretz_back`)

Dart Frog REST API. Requires a running PostgreSQL instance.

Routes:
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/posts` | Paginated post list |
| GET | `/posts/:slug` | Single post by slug |
| POST | `/posts` | Create/update post (upsert) — called by dashboard |
| DELETE | `/posts/:slug` | Delete post — called by dashboard |

Database setup: run `back/migrate.sql` against your PostgreSQL instance.

Environment variables:
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `staretz` | Database name |
| `DB_USER` | `staretz` | Database user |
| `DB_PASSWORD` | `` | Database password |

Run: `dart run dart_frog dev` from `back/`.
Test: `dart test` from `back/`.

## Commands (from repo root)

```
make run          # front on port 5000 (blog + dashboard)
make run-back     # Dart Frog backend on port 8080
make test         # all packages
make test-domain  # packages/domain only
make test-front   # front/ only
make test-back    # back/ only
make build        # build front for web
```
