# Tech Stack

## Runtime

| Concern | Choice |
|---------|--------|
| Framework | Flutter 3.44 (web target) |
| Language | Dart 3.12 |
| Browser | Brave (Chromium-based) |

## State management

| Concern | Choice |
|---------|--------|
| State / events | `flutter_bloc` — Cubits only (no full Blocs unless event complexity warrants it) |
| Pattern | BlocBuilder / BlocConsumer in dumb widgets; Cubits owned by containers |

## Dependency injection

| Concern | Choice |
|---------|--------|
| DI container | `get_it` |
| Contracts | Abstract Dart classes (one per port) |
| Registration | Single `di/container.dart` that merges feature module registrations |

## Content

| Concern | Choice |
|---------|--------|
| Post format | Markdown with YAML frontmatter |
| Storage | Files in `lib/blog/infrastructure/posts/` |
| Parsing | `markdown` pub package |
| Future | Headless CMS (TBD) — infrastructure adapter swap, no domain change |

## Testing

| Concern | Choice |
|---------|--------|
| Unit / arch tests | `flutter_test` + custom arch test helpers |
| Mocking | `mockito` (with code generation via `build_runner`) |
| Test data | Mother objects (no raw primitives in test setup) |
| E2E | `integration_test` package |

## Tooling

| Concern | Choice |
|---------|--------|
| Linting | `flutter_lints` |
| Build | Vite-equivalent is Flutter's own build system |
| Local SDK | `~/development/flutter` |
