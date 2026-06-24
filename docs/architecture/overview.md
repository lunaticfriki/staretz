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
      entities/
        post.dart              # Post entity
      value_objects/
        post_id.dart
        post_title.dart
        post_slug.dart
        post_image_url.dart
        post_excerpt.dart
        post_body.dart
        post_published_at.dart
      ports/
        post_repository.dart   # port (abstract class)
    application/
      post.read_service.dart
      post_state.dart
      post.state_service.dart
    infrastructure/
      json_post_repository.dart  # adapter implementing the port
    presentation/
      widgets/
        post_preview_card.dart
        post_preview_list.dart
        blog_post_list.dart
        post_detail_view.dart
      containers/
        home_preview.container.dart
        blog_page.container.dart
        post_detail.container.dart
  shared/
    pagination/
      page_criteria.dart       # Criteria pattern: describes what page to load
      paginated.dart           # Generic paginated result
      widgets/
        pagination_bar.dart
  di/
    container.dart
  main.dart
```

## Shared kernel

Cross-feature utilities (base value objects, error types, DI helpers) live in `lib/shared/`.

## Arch tests

Architecture rules are enforced by tests in `test/arch/`. See [testing.md](testing.md).
