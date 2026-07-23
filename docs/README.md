# Architecture Standards

Shared reference for how we build applications: Domain-Driven Design, Hexagonal
Architecture (Ports & Adapters), CQRS at the application layer, and Vertical
Slicing across features. This folder is technology-agnostic at its core, with
a dedicated adaptation doc for this project's stack, Preact + TypeScript (see
[08-tech-preact-typescript.md](08-tech-preact-typescript.md)). [modules/](modules/)
documents how the rules apply concretely to this application's own modules.

These documents are written for both human developers and AI coding
assistants. Rules are stated as MUST / MUST NOT / SHOULD so they can be
applied mechanically and checked in review or by arch tests.

## The one rule that outranks all others

**Domain logic lives in the domain layer, and nowhere else.** Application,
infrastructure, and presentation code MUST NOT contain business rules,
validation of business invariants, or decisions that belong to the domain.
Those layers orchestrate, adapt, and render — they do not decide. When in
doubt about where a piece of logic belongs, it belongs in the domain unless
it is strictly technical (I/O, framework wiring, rendering).

## Reading order

1. [01-domain-layer.md](01-domain-layer.md) — entities, value objects, private
   constructors, factories, object mothers, no primitives.
2. [02-hexagonal-architecture.md](02-hexagonal-architecture.md) — layers,
   ports/adapters, the dependency rule.
3. [03-application-layer-cqrs.md](03-application-layer-cqrs.md) — commands,
   queries, read/write services, why no use cases or data sources.
4. [04-infrastructure-layer.md](04-infrastructure-layer.md) — adapters,
   repository implementations, mapping.
5. [05-presentation-layer.md](05-presentation-layer.md) — containers,
   components, skeletons, state service.
6. [06-vertical-slicing.md](06-vertical-slicing.md) — organizing by feature
   instead of by layer, and the file naming convention.
7. [07-testing-strategy.md](07-testing-strategy.md) — arch tests, mocking
   ports, object mothers in tests.
8. [08-tech-preact-typescript.md](08-tech-preact-typescript.md) — concrete
   Preact + TypeScript adaptation.
9. [10-git-workflow-husky.md](10-git-workflow-husky.md) — commit script,
   pre-push test guard, stashing uncommitted work before testing.
10. [11-shared-services.md](11-shared-services.md) — ErrorManager and
    NotificationService as the canonical shared cross-cutting services.
11. [12-e2e-testing.md](12-e2e-testing.md) — Playwright + Cucumber +
    Gherkin end-to-end testing.
12. [glossary.md](glossary.md) — terms used across these docs.
13. [modules/](modules/) — docs for this application's own modules (about,
    blog, shared services), concrete instances of the rules above rather
    than general reference.

## How to use this in a new project

Copy this folder as-is into the new repository (e.g. `docs/architecture/`),
then follow [10-git-workflow-husky.md](10-git-workflow-husky.md) to wire up
Husky using the templates in `templates/`. Read the tech adaptation doc for
the stack you're using before writing your first vertical slice.

## Non-negotiables (summary)

- DDD tactical patterns in the domain layer: entities, value objects,
  aggregates, domain services, private constructors with `create`/`empty`
  factories.
- No primitives in the domain — every meaningful concept is a value object.
- TypeScript only: fields fixed at construction are `public readonly`, not
  `private` + a `getXxx()` method. Fields mutated internally to protect an
  invariant stay `private` with a `get` accessor instead of a method, so
  every field still reads as a plain property at the call site.
- TypeScript only: ports and application-service contracts are `abstract
  class`, not `interface` — implementations `extend` them. Plain data
  shapes (read models, command/query payloads) stay `interface`/`type`.
- Domain folder split by concept: `entities/`, `value-objects/`,
  `repositories/`, not a flat file listing.
- Infrastructure owns an Anti-Corruption Layer (`infrastructure/acl/`) that
  translates external shapes into domain objects, separate from the
  repository implementation that uses it.
- Tests live in a `__tests__/` folder co-located with what they test
  (`entities/__tests__/`, `infrastructure/__tests__/`, ...), never a
  project-wide test tree. Object Mothers live there too.
- File names follow `<Concept>.<kind>.ts` (`Post.entity.ts`,
  `Post.repository.ts`, `Home.container.tsx`, `PostPreview.component.tsx`,
  `useRecentPostsState.hook.ts`, ...) — see
  [06-vertical-slicing.md](06-vertical-slicing.md#file-naming-convention)
  for the full suffix table.
- Object Mothers for building test fixtures, never ad-hoc literals scattered
  across tests.
- Preact: read/write services have **zero library dependencies**. A
  separate `<Concept>.stateService.ts` is the only file allowed to depend
  on `@preact/signals-core`, holding the `Signal` and composing the
  read/write services — same split for every module going forward.
  `@preact/signals` (the Preact integration) is imported once at the app
  root to activate re-rendering.
- Read models are optional: a query MAY return the domain entity directly
  instead of a hand-written DTO when the entity is read-only (no behavior,
  no mutable state) — see
  [05-presentation-layer.md](05-presentation-layer.md#read-models-are-optional--presentation-may-render-a-domain-entity-directly).
  Keep the DTO for anything with behavior or mutable state.
- Errors and warnings are domain types (`DomainError`/`DomainWarning` in
  `shared/errors/domain/`), declared in the domain layer even when an
  application handler is what detects the condition — see
  [01-domain-layer.md](01-domain-layer.md#domain-errors-and-warnings-live-in-the-domain-not-the-application-layer).
- `ErrorManager` and `NotificationService` in `shared/` are the canonical
  cross-cutting services, following the exact same domain/pure-service/
  state-service pattern as a feature module — see
  [11-shared-services.md](11-shared-services.md). Build future shared
  services (auth session, feature flags, ...) the same way.
- Hexagonal architecture: `domain / application / infrastructure /
  presentation`, dependencies point inward only.
- CQRS in the application layer: separate read services (queries) and write
  services (commands). No "use case" classes, no "data source" abstraction.
- Vertical slicing: folders organized by feature/bounded context first, by
  layer second.
- Presentation: containers (data/state-aware) vs components (pure/props-only),
  skeletons for loading states, a state service holding UI-facing reactive
  state.
- No unit tests over presentation (containers/components) — no mocked
  container tests, no isolated component tests. Presentation is covered
  exclusively by end-to-end tests against a real browser/build — see
  [07-testing-strategy.md](07-testing-strategy.md#presentation-is-not-unit-tested).
- Arch tests (`pnpm arch-test`, `dependency-cruiser` via
  `.dependency-cruiser.cjs` at the repo root) enforce the dependency rule —
  layer violations fail the build, not just code review. See
  [07-testing-strategy.md](07-testing-strategy.md#arch-tests--enforce-the-dependency-rule-in-ci).
- ts-mockito to mock ports when testing application services.
- InversifyJS as the composition-root DI container in TypeScript projects —
  bind ports to concretes with `toDynamicValue`, not decorator-based
  auto-wiring (see [08-tech-preact-typescript.md](08-tech-preact-typescript.md)
  for why).
- No comments in code. Names and structure carry the meaning.
- A `prepare-commit-msg` Husky hook prompts for a conventional-commit type on
  every `git commit` — no wrapper script to remember; pre-push hook stashes
  uncommitted changes, runs the test suite against exactly what's committed,
  then restores the stash regardless of outcome.
- End-to-end tests run through Cucumber (the actual runner) driving
  Playwright, scenarios in Gherkin, against a real production build — see
  [12-e2e-testing.md](12-e2e-testing.md). Kept out of the `pre-push` hook
  on purpose; run on demand and in CI.
