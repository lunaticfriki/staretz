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
- **Firebase** (Cloud Firestore, Auth, Storage) as the post data source,
  the dashboard's login, and uploaded post images
- **marked** to render post content from Markdown
- **Vitest** + **ts-mockito** + **@testing-library/preact** + **jsdom** for
  unit/integration testing
- **Playwright** + **Cucumber** (Gherkin/BDD) for end-to-end testing
- **Husky** + **commitlint** for the git workflow

## Getting started

```bash
pnpm install
cp .env.example .env   # fill in your Firebase project's web app config
pnpm dev
```

Posts are read from a Cloud Firestore **`posts`** collection (see
[Architecture](#architecture) below) — without a valid `.env`, the app
will fail to load post data. Open the printed local URL: the dev server
serves the home page, category browsing/search pages, an About page, and
one page per post at `/blog/:slug`.

## Dashboard (private)

`/dashboard` is a private, login-gated screen for writing and
publishing new posts — see [docs/modules/dashboard.md](docs/modules/dashboard.md),
[docs/modules/shared-auth.md](docs/modules/shared-auth.md), and
[docs/modules/shared-policies.md](docs/modules/shared-policies.md) for
the full architecture. To actually use it, two things need setting up
once in the Firebase Console (no CLI command does these — unlike
Firestore/Storage, which auto-enable on `firebase deploy`):

1. **Authentication → Sign-in method** → enable the Email/Password
   provider.
2. **Authentication → Users** → add at least one user (email +
   password) — that's who can log in at `/login`.

Firestore/Storage security rules (`firestore.rules`/`storage.rules`,
deployed via `firebase deploy --only firestore:rules,storage`) already
restrict writes to authenticated users and leave reads public, so the
public blog keeps working with no account at all.

## Scripts

| Command                | What it does                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `pnpm dev`              | Start the Vite dev server                                                           |
| `pnpm build`            | Type-check (`tsc -b`) and produce a production build                               |
| `pnpm preview`          | Serve the production build locally                                                 |
| `pnpm test`             | Run the unit/integration test suite once                                           |
| `pnpm test:watch`       | Run the unit/integration suite in watch mode                                       |
| `pnpm test:e2e`         | Build, serve, and run the Cucumber/Playwright end-to-end suite against it          |
| `pnpm typecheck:e2e`    | Type-check the `e2e/` folder on its own (also run automatically by `test:e2e`)      |
| `pnpm dev:tmux`         | Open a tmux session split into server / tests / empty panes (`scripts/dev-tmux.sh`) |

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
      infrastructure/  — FirebasePost.repository.ts (bound), FakePost.repository.ts (in-memory)
        acl/
      presentation/    — containers, components, skeletons, hooks
        containers/
        components/
    about/
      presentation/    — a fully static page, no other layers needed
    dashboard/
      domain/          — PostImageUploader port, MissingPostImageError
      application/     — PublishPost/EditPost command/handlers + PostManagement state service
      infrastructure/  — FirebasePostImageUploader (bound), FakePostImageUploader
      presentation/    — private post management area (list/create/edit/delete), guarded by shared/policies
  shared/
    auth/              — email/password login (Firebase Auth), AuthStateService
    policies/           — PolicyService.can(name, context) authorization
    errors/            — DomainError/DomainWarning + ErrorManager
    notifications/     — Notification entity + NotificationService/StateService
    presentation/      — Layout, Header, Footer, NotFoundPage, RequirePolicy
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
  `usePostsPageState.hook.ts`, etc.
- **Tests** live in a `__tests__/` folder co-located with what they test,
  never a project-wide test tree. Object Mothers (`Post.mother.ts`) live
  there too.

Posts are currently read from Cloud Firestore's `posts` collection via
`FirebasePostRepository` — see [docs/modules/blog.md](docs/modules/blog.md#infrastructure)
for the expected document shape. `FakePostRepository` (loading
`src/data/posts/*.md` via `import.meta.glob`) is kept as an in-memory
alternative behind the same `PostRepository` port; switching between
them is a one-line change in `composition-root.ts`, nothing above the
infrastructure layer needs to change.

## Testing

```bash
pnpm test
```

Covers domain invariants (no mocks needed), application services (mocked
ports via `ts-mockito`), a real integration test against the actual seed
data (no mocks at all), and a full DOM-rendered test of routing/navigation
via `@testing-library/preact` + `jsdom`.

## End-to-end testing

```bash
pnpm test:e2e
```

Scenarios are written in Gherkin and executed by `@cucumber/cucumber`,
driving a real Chromium browser via Playwright:

```
e2e/
  features/           — .feature files (Given/When/Then scenarios)
  step-definitions/    — Given/When/Then implementations, using Playwright's page
  support/
    world.ts           — the Cucumber World, carrying the Playwright Page
    hooks.ts           — launches/closes the browser and a fresh context per scenario
```

`pnpm test:e2e` (`scripts/e2e.sh`) type-checks `e2e/`, builds the app,
serves the production build on `localhost:4173`, waits for it to respond,
runs every `.feature` file against it, and tears the server down
afterward regardless of outcome. It's a real, separate browser +
production build — not a mock, and not the dev server.

To add a scenario: write it in a `.feature` file, then implement any new
Given/When/Then step in `e2e/step-definitions/` (reuse the existing
navigation/assertion steps where the wording already fits — `cucumber-js`
will report "undefined" steps if a Gherkin line doesn't match anything).

**Current caveat**: several scenarios assert against the 20-post
`FakePostRepository` seed catalog (exact post counts, specific titles,
per-category counts). Now that `composition-root.ts` binds
`FirebasePostRepository`, `pnpm test:e2e` runs against whatever is
actually in the Firestore `posts` collection — those count/title-specific
scenarios will fail unless the collection's content matches what they
expect. This isn't a code bug; it's pending a decision on whether to seed
Firestore with matching content, rewrite the scenarios around real
content, or point e2e specifically at `FakePostRepository` regardless of
what production binds.

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
