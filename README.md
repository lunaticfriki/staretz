# Staretz

A small blog built with Preact, TypeScript, and
Tailwind CSS — and used as the reference implementation for a
domain-driven, hexagonal architecture with CQRS and vertical slicing.

## Tech stack

- **Preact** + **TypeScript** + **Vite**
- **Tailwind CSS** (with `@tailwindcss/typography` for rendered post content)
- **preact-router** for client-side routing
- **@preact/signals-core** for reactive state (isolated to each module's
  state service — see [Architecture](#architecture))
- **InversifyJS** for dependency injection
- **marked** to render post content from Markdown
- **Vitest** + **ts-mockito** + **@testing-library/preact** + **jsdom** for
  testing
- **Husky** + **commitlint** for the git workflow

## Getting started

```bash
pnpm install
pnpm dev
```

Open the printed local URL. The dev server serves the home page (latest 5
posts), an About page, and one page per post at `/blog/:slug`.

## Scripts

| Command           | What it does                                                                        |
| ----------------- | ----------------------------------------------------------------------------------- |
| `pnpm dev`        | Start the Vite dev server                                                           |
| `pnpm build`      | Type-check (`tsc -b`) and produce a production build                                |
| `pnpm preview`    | Serve the production build locally                                                  |
| `pnpm test`       | Run the full test suite once                                                        |
| `pnpm test:watch` | Run tests in watch mode                                                             |
| `pnpm dev:tmux`   | Open a tmux session split into server / tests / empty panes (`scripts/dev-tmux.sh`) |

## Architecture

The codebase follows a strict layering per feature module, organized by
feature first (**vertical slicing**), not by technical layer:

```
src/
  modules/
    blog/
      domain/          — Post entity, value objects, repository port, errors
        entities/
        value-objects/
        repositories/
        errors/
      application/     — CQRS queries + read/state services
        query/
        Post.readService.ts    (no library dependencies)
        Post.stateService.ts   (the only file with a signals dependency)
      infrastructure/  — FakePost.repository.ts + its Anti-Corruption Layer
        acl/
      presentation/    — containers, components, skeletons, hooks
        containers/
        components/
    about/
      presentation/    — a fully static page, no other layers needed
  shared/
    errors/            — DomainError/DomainWarning + ErrorManager
    notifications/     — Notification entity + NotificationService/StateService
    presentation/      — Layout, Header, Footer, NotFoundPage
    di/                — InversifyJS symbol tokens
  composition-root.ts  — wires every port to its concrete implementation
```

Rules this project follows throughout:

- **Domain first.** Business rules live in entities/value objects, never in
  application, infrastructure, or presentation.
- **No primitives in the domain.** Every meaningful concept (`Slug`,
  `PostTitle`, ...) is a value object with a private constructor and
  `create`/`empty` factory methods.
- **Ports are `abstract class`, not `interface`** (e.g. `PostRepository`,
  `PostReadService`) — concrete implementations `extend` them. This gives
  them a real runtime identity, usable as InversifyJS DI tokens.
- **CQRS, no use cases.** Reads and writes are separate services backed by
  query/command handlers, not a generic "use case" per action.
- **Read/write services have zero library dependencies.** Reactive state
  lives in one dedicated `<Concept>.stateService.ts` per module — the only
  place `@preact/signals-core` is imported. `@preact/signals` itself (the
  Preact rendering integration) is imported once, as a side effect, in
  `app.tsx`.
- **Errors and warnings are domain types**, declared under
  `domain/errors/` even when an application handler is what detects them
  (e.g. `PostNotFoundError`). `ErrorManager` (in `shared/`) turns a caught
  `DomainError`/`DomainWarning` into a user-facing notification.
- **Read models are optional.** `Post` is read-only (no behavior, no
  mutable state), so its query handlers return the domain entity directly
  instead of a hand-written DTO — presentation renders its value-object
  fields with `.toString()`.
- **File naming**: `<Concept>.<kind>.ts` throughout — `Post.entity.ts`,
  `Slug.valueObject.ts`, `Home.container.tsx`, `PostPreview.component.tsx`,
  `useRecentPostsState.hook.ts`, etc.
- **Tests** live in a `__tests__/` folder co-located with what they test,
  never a project-wide test tree. Object Mothers (`Post.mother.ts`) live
  there too.

The blog post seed data lives in `src/data/posts/*.md` (20 posts), loaded
by `FakePost.repository.ts` via `import.meta.glob`. Swap that repository
implementation for a Firebase-backed one behind the same `PostRepository`
port when ready — nothing above the infrastructure layer needs to change.

## Testing

```bash
pnpm test
```

Covers domain invariants (no mocks needed), application services (mocked
ports via `ts-mockito`), a real integration test against the actual seed
data (no mocks at all), and a full DOM-rendered test of routing/navigation
via `@testing-library/preact` + `jsdom`.

## Git workflow

Commits are conventional (`feat: ...`, `fix: ...`, etc.), enforced by
`commitlint`. Run `git commit` or `git cm` (if you've set up that alias) in
a real terminal — a `prepare-commit-msg` hook prompts you to pick a type,
scope, and description, and writes the message for you; no separate
wrapper script to remember. Passing `-m` bypasses the prompt but the
message still has to pass `commitlint`.

`git push` runs the full test suite first: any uncommitted changes are
stashed before the tests run (so you're only ever testing what's actually
about to be pushed) and restored afterward regardless of the outcome.
