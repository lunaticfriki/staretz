# Vertical Slicing

Folders are organized by feature/bounded context first, by layer second. A
developer working on "orders" should be able to find everything relevant to
orders in one place, rather than jumping between a global `domain/`,
`services/`, and `components/` tree hunting for order-related files.

## Shape

```
.dependency-cruiser.cjs
src/
  modules/
    ordering/
      domain/
        entities/
          Order.entity.ts
          __tests__/
            Order.entity.test.ts
            Order.mother.ts
        value-objects/
          OrderId.valueObject.ts
          OrderLine.valueObject.ts
          OrderStatus.valueObject.ts
        repositories/
          Order.repository.ts
        errors/
          OrderAlreadyConfirmed.error.ts
      application/
        command/
          ConfirmOrder.command.ts
          ConfirmOrder.commandHandler.ts
        query/
          GetOrder.query.ts
          GetOrder.queryHandler.ts
        Order.readModel.ts
        Order.readService.ts
        Order.writeService.ts
        Order.stateService.ts
      infrastructure/
        HttpOrder.repository.ts
        acl/
          Order.mapper.ts
        __tests__/
          HttpOrder.repository.test.ts
      presentation/
        containers/
          OrderDetails.container.tsx
        components/
          OrderDetails.component.tsx
          OrderDetails.skeleton.tsx
        useOrderDetailsState.hook.ts
    catalog/
      domain/
      application/
      infrastructure/
      presentation/
  shared/
    errors/
      domain/
        Domain.error.ts
        Domain.warning.ts
      application/
        ErrorManager.service.ts
    notifications/
      domain/
        entities/
          Notification.entity.ts
        value-objects/
          NotificationId.valueObject.ts
          NotificationMessage.valueObject.ts
      application/
        NotificationService.service.ts
        Notification.stateService.ts
```

`Order` keeps its `Order.readModel.ts` in this example specifically because
it has behavior and mutable state (see
[05-presentation-layer.md](05-presentation-layer.md#read-models-are-optional--presentation-may-render-a-domain-entity-directly))
— a simpler, read-only entity would skip that file and have its read/state
services work with the domain entity directly. `shared/errors/` and
`shared/notifications/` are themselves full examples of this same
structure applied to cross-cutting concerns — see
[11-shared-services.md](11-shared-services.md). `.dependency-cruiser.cjs`
at the repo root is what actually enforces the horizontal dependency rule
between these layers in CI — see
[07-testing-strategy.md](07-testing-strategy.md#arch-tests--enforce-the-dependency-rule-in-ci).

## File naming convention

Every file is named `<Concept>.<kind>.<ext>` — the domain concept the file
is about, then a suffix identifying what kind of thing it is. The kind
suffix is fixed vocabulary; skimming a directory listing tells you what
everything is without opening a file.

| Kind | Suffix | Example |
|---|---|---|
| Entity | `.entity.ts` | `Post.entity.ts` |
| Value object | `.valueObject.ts` | `Slug.valueObject.ts` |
| Collection | `.collection.ts` | `Post.collection.ts` |
| Object Mother | `.mother.ts` | `Post.mother.ts` |
| Repository (port or adapter) | `.repository.ts` | `Post.repository.ts` (port), `FakePost.repository.ts` (adapter) |
| Domain/application error | `.error.ts` | `PostNotFound.error.ts` |
| Read model / DTO | `.readModel.ts` | `Post.readModel.ts` |
| Read service | `.readService.ts` | `Post.readService.ts` |
| Write service | `.writeService.ts` | `Order.writeService.ts` |
| Query | `.query.ts` | `GetPostBySlug.query.ts` |
| Query handler | `.queryHandler.ts` | `GetPostBySlug.queryHandler.ts` |
| Command | `.command.ts` | `ConfirmOrder.command.ts` |
| Command handler | `.commandHandler.ts` | `ConfirmOrder.commandHandler.ts` |
| Mapper (ACL) | `.mapper.ts` | `Post.mapper.ts` |
| Utility/helper function | `.util.ts` | `formatPublishedAt.util.ts` |
| Container | `.container.tsx` | `Home.container.tsx` |
| Component | `.component.tsx` | `PostPreview.component.tsx` |
| Skeleton | `.skeleton.tsx` | `PostPreview.skeleton.tsx` |
| Hook / state service | `.hook.ts` | `useRecentPostsState.hook.ts` |
| Test | append `.test.ts`/`.integration.test.ts` after the kind | `Post.entity.test.ts` |

Rules:

- The concept name is whatever the file is fundamentally about — usually,
  but not always, matching the exported symbol. A repository port file
  `Post.repository.ts` exports `PostRepository`; a concrete adapter is
  named for what makes it distinct — `FakePost.repository.ts`,
  `HttpOrder.repository.ts` — not a second copy of "Repository" in the
  concept name.
- Drop the word from the concept name if the suffix already says it —
  `GetPostBySlugQuery` becomes `GetPostBySlug.query.ts`, not
  `GetPostBySlugQuery.query.ts`.
- Hooks keep the `use` prefix required by React/Preact tooling
  (`useRecentPostsState.hook.ts`, not `RecentPostsState.hook.ts`) — the
  kind suffix is appended after it, not instead of it.
- A port and its adapter both get `.repository.ts` — they're
  distinguished by folder (`domain/repositories/` vs `infrastructure/`) and
  by the adapter's distinguishing prefix, not by a different suffix.
- Test files keep the production file's full name and insert nothing —
  they just add `.test.ts` (or `.integration.test.ts`) after the existing
  kind suffix: `Post.entity.ts` → `Post.entity.test.ts`.
- **Exempt**: entry-point/scaffold files that don't represent one of the
  kinds above — `main.tsx`, the root `app.tsx`, `index.css`,
  `composition-root.ts`, a DI `types.ts` token map, a shared prop-type
  contract like `RouteProps.ts`. These keep plain descriptive names.

## Rules

- A module (`ordering`, `catalog`, ...) corresponds to a bounded
  context/feature area, not a technical concern. If you can't name it with a
  business noun, it's probably not a module boundary.
- Within a module, the four hexagonal layers still apply, and the dependency
  rule from [02-hexagonal-architecture.md](02-hexagonal-architecture.md)
  still holds — vertical slicing organizes folders, it does not relax the
  layering.
- `shared/` holds truly cross-cutting, stable primitives (generic value
  objects like `Money`, the base `DomainError`, arch-test rule
  configuration). It is not a dumping ground — if something is only used by
  one module, it stays in that module.
- Cross-module communication goes through a module's application layer
  (its commands/queries), never by one module reaching into another
  module's domain or infrastructure internals.
- A new feature means a new module folder with its own four layers, not new
  branches inside an existing module's files.

## Why

- Deleting a feature is deleting a folder.
- Arch tests can enforce both the horizontal rule (layer dependencies) and,
  optionally, the vertical rule (no module importing another module's
  internals) in one pass.
- Cognitive load per task drops: the files you need for "confirm an order"
  are co-located, not scattered across a layer-first tree.
