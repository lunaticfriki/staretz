# Architecture Overview

## Monorepo packages

```
staretz/
  packages/domain/    staretz_domain   — shared domain (pure Dart)
  front/              staretz           — Flutter web, public blog + CMS
  back/               staretz_back      — Dart Frog REST API
```

See [monorepo.md](monorepo.md) for the full package dependency graph and per-package run/test commands.

## Hexagonal Architecture (Ports & Adapters)

Each package follows the same four-layer model. Dependencies point inward.

```
┌─────────────────────────────────────────────────┐
│  Presentation  (Flutter widgets, Cubits)         │
│  ┌───────────────────────────────────────────┐   │
│  │  Application  (Read / Write / State svc)  │   │
│  │  ┌─────────────────────────────────────┐  │   │
│  │  │  Domain  (Entities, VOs, ports)     │  │   │
│  │  └─────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────┘   │
│  Infrastructure  (adapters, repos, parsers)       │
└─────────────────────────────────────────────────┘
```

> **back/** has no Presentation layer — routes replace it.

## Layer rules

| From \ To | Domain | Application | Infrastructure | Presentation |
|-----------|--------|-------------|----------------|--------------|
| Domain | ✓ | ✗ | ✗ | ✗ |
| Application | ✓ | ✓ | ✗ | ✗ |
| Infrastructure | ✓ | ✓ | ✓ | ✗ |
| Presentation | ✓ | ✓ | ✗ | ✓ |

Presentation never imports Infrastructure directly. It talks to Application services through Cubits.

Application in one module may import Application from another module in the same package (e.g. `dashboard` imports `blog`'s `PostReadService`).

## Shared domain (`packages/domain`)

Domain code shared across packages lives in `packages/domain` (`staretz_domain`). Each app imports it as a path dependency. The package is pure Dart — no Flutter, no server dependencies.

Contents:
- `blog/domain/` — Post entity, value objects, PostRepository port
- `shared/domain/` — AppTheme, ThemeRepository port
- `shared/pagination/` — PageCriteria, Paginated

## Feature module structure

### front (`lib/`)

```
lib/
  blog/               # public blog (read-only)
    application/
    infrastructure/   # MarkdownPostRepository
    presentation/
  dashboard/          # CMS (read + write via back-end API)
    application/
    infrastructure/   # HttpPostRepository
    presentation/
  shared/
  di/
    container.dart
  main.dart
  router.dart
```

### back (`lib/` + `routes/`)

```
lib/
  blog/
    application/
    infrastructure/   # PostgresPostRepository
  di/
    container.dart
routes/               # HTTP handlers (replace Presentation layer)
  posts/
```

## Arch tests

Architecture rules are enforced by tests in each package's `test/arch/`. See [testing.md](testing.md).
