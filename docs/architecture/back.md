# Back Layer (Dart Frog)

## Architecture

The back-end follows the same hexagonal architecture as front and dashboard, with these layers:

```
routes/            # HTTP handlers (Dart Frog entry points)
lib/
  blog/
    application/   # Read/Write services — same pattern as front
    infrastructure/# PostgresPostRepository — implements domain port
  di/
    container.dart # AppContainer — wires everything together
```

## Layer rules

| From \ To | Domain | Application | Infrastructure |
|-----------|--------|-------------|----------------|
| Application | ✓ | ✓ | ✗ |
| Infrastructure | ✓ | ✓ | ✓ |
| Routes | ✓ | ✓ | ✗ |

Routes read services from the request context (injected by `_middleware.dart`). They never import infrastructure directly.

## Services

| File | Responsibility |
|------|---------------|
| `post.read_service.dart` | Fetches posts — delegates to PostRepository port |
| `post.write_service.dart` | Saves / deletes posts — delegates to PostRepository port |

## Infrastructure adapter

`PostgresPostRepository` implements the domain `PostRepository` port using the `postgres` Dart package. It maps SQL rows to domain entities in `_rowToPost` — all parsing belongs here, never in the domain.

## Routes

| Route | Method | Handler |
|-------|--------|---------|
| `/posts` | GET | paginated post list |
| `/posts` | POST | create/update post (upsert) |
| `/posts/:slug` | GET | single post by slug |
| `/posts/:slug` | DELETE | delete post |

## Dependency injection

`AppContainer.build()` opens a single PostgreSQL connection and wires the repository and services. The root `_middleware.dart` builds the container once and injects `PostReadService` and `PostWriteService` into every request context via `provider<T>`.

## Testing

Unit tests mock `PostRepository` with `mocktail`. Integration tests (not yet written) would need a test database. Arch tests enforce the service naming convention and layer boundaries.
