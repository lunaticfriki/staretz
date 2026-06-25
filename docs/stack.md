# Tech Stack

## Runtime

| Concern | Choice |
|---------|--------|
| Language | Dart 3.12 |
| Front framework | Flutter 3.44 (web target) |
| Back framework | Dart Frog 1.2 |
| Dashboard framework | Flutter 3.44 (web target) |
| Database | PostgreSQL |
| Browser (dev) | Firefox (via `web-server` device — no CDP needed) |

## Front

| Concern | Choice |
|---------|--------|
| State / events | `flutter_bloc` — Cubits only |
| DI | `get_it` |
| Routing | `go_router` |
| Content | Markdown files in `front/lib/blog/infrastructure/posts/` |
| Content parsing | `yaml` package (frontmatter) |

## Back

| Concern | Choice |
|---------|--------|
| HTTP server | `dart_frog` |
| Database client | `postgres` |
| Config | `Platform.environment` (no dotenv library) |

## Dashboard

| Concern | Choice |
|---------|--------|
| State / events | `flutter_bloc` — Cubits only |
| DI | `get_it` |
| Routing | `go_router` |
| Auth | `google_sign_in` |
| API client | `http` |

## Shared domain

| Concern | Choice |
|---------|--------|
| Package name | `staretz_domain` |
| Path | `packages/domain/` |
| Flutter dependency | None — pure Dart |

## Testing

| Concern | Choice |
|---------|--------|
| Front / Dashboard unit & arch | `flutter_test` + custom arch test helpers |
| Back unit & arch | `dart test` (`package:test`) |
| Domain unit & arch | `dart test` (`package:test`) |
| Mocking | `mocktail` (all packages) |
| Test data | Mother objects (no raw primitives in test setup) |
| E2E | `integration_test` package (front only) |

## Tooling

| Concern | Choice |
|---------|--------|
| Linting | `flutter_lints` (front, dashboard), `lints` (back, domain) |
| Local Flutter SDK | `~/development/flutter` |
| Git hooks | Husky (pre-push runs tests) |
