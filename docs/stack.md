# Tech Stack

## Runtime

| Concern | Choice |
|---------|--------|
| Language | Dart 3.12 |
| Front framework | Flutter 3.44 (web target) |
| Back framework | Dart Frog 1.2 |
| Database | PostgreSQL |
| Browser (dev) | Firefox (via `web-server` device — no CDP needed) |

## Front (`front/`)

Serves two feature modules at port 5000:

| Module | Routes | Description |
|--------|--------|-------------|
| `blog` | `/`, `/blog`, `/blog/:slug` | Public read-only blog |
| `dashboard` | `/dashboard`, `/dashboard/new`, `/dashboard/:slug/edit` | CMS — create/edit/delete posts |

| Concern | Choice |
|---------|--------|
| State / events | `flutter_bloc` — Cubits only |
| DI | `get_it` |
| Routing | `go_router` |
| Blog content | Markdown files in `front/lib/blog/infrastructure/posts/` |
| Blog content parsing | `yaml` package (frontmatter) |
| Dashboard API client | `http` package → `HttpPostRepository` |

## Back (`back/`)

| Concern | Choice |
|---------|--------|
| HTTP server | `dart_frog` |
| Database client | `postgres` |
| Config | `Platform.environment` (no dotenv library) |

## Shared domain (`packages/domain/`)

| Concern | Choice |
|---------|--------|
| Package name | `staretz_domain` |
| Flutter dependency | None — pure Dart |
| Used by | `front/` and `back/` via path dependency |

## Testing

| Concern | Choice |
|---------|--------|
| Front unit & arch | `flutter_test` + custom arch test helpers |
| Back unit & arch | `dart test` (`package:test`) |
| Domain unit & arch | `dart test` (`package:test`) |
| Mocking | `mocktail` (all packages) |
| Test data | Mother objects (no raw primitives in test setup) |
| E2E | `integration_test` package (front only) |

## Tooling

| Concern | Choice |
|---------|--------|
| Linting | `flutter_lints` (front), `lints` (back, domain) |
| Local Flutter SDK | `~/development/flutter` |
| Git hooks | Husky (pre-push runs tests) |
