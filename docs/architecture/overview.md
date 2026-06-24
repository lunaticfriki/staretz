# Architecture Overview

## Hexagonal Architecture (Ports & Adapters)

The application is divided into four layers. Dependencies point inward — outer layers depend on inner layers, never the reverse.

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

## Layer rules

| From \ To | Domain | Application | Infrastructure | Presentation |
|-----------|--------|-------------|----------------|--------------|
| Domain | ✓ | ✗ | ✗ | ✗ |
| Application | ✓ | ✓ | ✗ | ✗ |
| Infrastructure | ✓ | ✓ | ✓ | ✗ |
| Presentation | ✓ | ✓ | ✗ | ✓ |

Presentation never imports Infrastructure directly. It talks to Application services through Cubits.

## Feature module structure

Each feature lives under `lib/<feature>/`:

```
lib/
  blog/
    domain/
      post.dart               # Post entity
      post_title.dart         # PostTitle value object
      post_repository.dart    # port (abstract class)
    application/
      post.read-service.dart
      post.write-service.dart
      post.state-service.dart
    infrastructure/
      post.repository.dart    # adapter implementing the port
      posts/                  # markdown source files
    presentation/
      post_list.container.dart
      post_list.dart          # dumb widget
  di/
    container.dart
  main.dart
```

## Shared kernel

Cross-feature utilities (base value objects, error types, DI helpers) live in `lib/shared/`.

## Arch tests

Architecture rules are enforced by tests in `test/arch/`. See [testing.md](testing.md).
