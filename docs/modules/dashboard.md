# Module: Dashboard

The private admin screen for writing and publishing new blog posts.
Unlike [about.md](about.md), it earns the full four-layer shape: it has
a real domain port of its own (`PostImageUploader`) and a real
orchestration concern (upload the image, *then* create the post) that
belongs in an application-layer command handler, not in a container.

## Routes

| Path | Container | Guarded by |
|---|---|---|
| `/dashboard` | `DashboardContainer` | `DASHBOARD_ACCESS_POLICY` (see below) |

Registered in [`app.tsx`](../../src/app.tsx), wrapped in
`RequirePolicy` rather than mounted directly — see
[shared-policies.md](shared-policies.md#presentation) for how the guard
works. `/login` (`LoginPage`, unguarded) is the redirect target when the
policy fails.

## Domain

```
src/modules/dashboard/
  domain/
    repositories/
      PostImageUploader.repository.ts
    errors/
      MissingPostImage.error.ts
  dashboardPolicy.ts
```

**`PostImageUploader`** (port, `abstract class`) declares
`upload(file: File): Promise<string>` — a generic technical capability,
"hand this blob to storage, get a URL back," with no business meaning
to model around, the same spirit as
[04-infrastructure-layer.md](../04-infrastructure-layer.md#what-belongs-here)'s
"wrappers around third-party SDKs, so the rest of the app depends on
our own port, not the SDK's API surface." It returns a plain `string`,
not `blog`'s `PostImage` value object — dashboard's domain has no
reason to import a value object that belongs to another module; the
raw URL is handed to `blog`'s `CreatePostCommand` (itself a bag of
primitives) one layer up, in this module's own application handler
(see [Application](#application) below). `File` (the browser API type)
appearing in a domain port is the one place this module's domain layer
touches a presentation-adjacent type, for the same reason
`blog`'s `Post.repository.ts` doesn't need to: uploading is a distinct
technical operation from persisting a `Post`, so it gets its own port
rather than `PostRepository.save()` growing a `File` parameter it
doesn't otherwise need.

**`MissingPostImageError`** (`extends DomainError`) is thrown by
`PublishPostCommandHandler` when no file was selected — see
[01-domain-layer.md](../01-domain-layer.md#domain-errors-and-warnings-live-in-the-domain-not-the-application-layer)
for why this type lives in domain even though application is what
detects and throws it. In practice the `<input type="file" required>`
in `PostForm` already stops the browser from submitting without a
file; this is defense-in-depth at the orchestration boundary, not the
primary guard.

**`dashboardPolicy.ts`** is the one non-layered file: it exports
`DASHBOARD_ACCESS_POLICY = PolicyName.create('dashboard:access')`, the
single source of truth for that string, imported by both `app.tsx`
(to guard the route) and `composition-root.ts` (to register which
`Policy` answers for it). It's a plain, kind-suffix-less file — the
same exemption `RouteProps.ts`/`composition-root.ts` get in
[06-vertical-slicing.md](../06-vertical-slicing.md#file-naming-convention),
for a constant rather than a class hierarchy.

## Application

```
src/modules/dashboard/application/
  command/
    PublishPost.command.ts
    PublishPost.commandHandler.ts
    __tests__/
      PublishPost.commandHandler.test.ts
  PublishPost.stateService.ts
  __tests__/
    PublishPost.stateService.test.ts
```

**`PublishPostCommand`**: raw primitives (`slug`, `title`, `excerpt`,
`content`, `author`, `category`, `publishedAt` — all `string`) plus
`imageFile: File | null` — the one field `blog`'s `CreatePostCommand`
doesn't have, because uploading it is this module's job, not `blog`'s.

**`PublishPostCommandHandler`** is the orchestration this whole
refactor exists for: `1)` if `command.imageFile` is `null`, throws
`MissingPostImageError` immediately — no upload attempted; `2)`
`PostImageUploader.upload(command.imageFile)` resolves to a real URL;
`3)` builds `blog`'s `CreatePostCommand` (with that URL as `image`) and
calls `PostWriteService.createPost()`
([blog.md](blog.md#application)). This is the sanctioned
cross-module shape from
[06-vertical-slicing.md](../06-vertical-slicing.md#rules):
`dashboard`'s application depends on `blog`'s *application* layer
(`PostWriteService`, a port-like abstract class), never on `blog`'s
domain or infrastructure directly — `dashboard` doesn't know
`CreatePostCommandHandler` or `PostRepository` exist. If the image
upload fails, `createPost()` is never called — no orphaned post with a
dead image URL.

**`PublishPostStateService`** — the only file in this module depending
on `@preact/signals-core`, same rule as `blog`'s `Post.stateService.ts`
([blog.md](blog.md#application)). One signal, `state: Signal<PublishPostState>`
(`idle | submitting | submitted`). `publish(command)` sets `submitting`,
calls `PublishPostCommandHandler.handle()`, and on success sets
`submitted` and calls `NotificationStateService.notify('success', ...)`
directly (there's no failure-shaped counterpart to report through
`ErrorManager` on the happy path); on failure it resets to `idle` and
routes the error through `ErrorManager`
([shared-errors.md](shared-errors.md)) — the same pattern
`PostStateService.loadPosts()`/`loadCategories()` use
([blog.md](blog.md#application)), rather than calling
`NotificationStateService.notify('error', ...)` itself. `submitted` is
a terminal signal, not auto-reset back to `idle` — the form stays
disabled/showing its last state until the user navigates away, since
nothing in this screen currently re-submits from the same instance.

## Infrastructure

```
src/modules/dashboard/infrastructure/
  FirebasePostImageUploader.repository.ts
  FakePostImageUploader.repository.ts
  storage.ts
```

**`FirebasePostImageUploader`** is the `PostImageUploader` adapter
bound in `composition-root.ts`: `upload(file)` writes to Cloud Storage
at `posts/<timestamp>-<filename>` via `uploadBytes()`, then resolves
the public URL via `getDownloadURL()`. Uses `storage.ts`
(`getStorage(firebaseApp)`, same one-line pattern as `blog`'s
`firestore.ts` — see [blog.md](blog.md#infrastructure)) and the *full*
`firebase/storage` import (no lite variant exists for Storage, unlike
Firestore). **`FakePostImageUploader`** is its in-memory-development
counterpart: `URL.createObjectURL(file)` returns a local blob URL good
for the current browser session only — no real upload, no network
call, pairs with `blog`'s `FakePostRepository` for offline development.
Swapping between them is the same one-line `composition-root.ts` change
as any other port ([04-infrastructure-layer.md](../04-infrastructure-layer.md#one-implementation-per-port-swappable)).

`storage.ts` (and the Storage capability generally) moved here from
`blog/infrastructure/` — `blog`'s read side never touched Cloud
Storage; only the authoring flow uploads images, so the adapter now
lives next to the only module that uses it.

## Presentation

```
src/modules/dashboard/presentation/
  containers/
    Dashboard.container.tsx
  components/
    PostForm.component.tsx
  usePublishPostState.hook.ts
```

**`PostForm`** is a self-contained, pure-ish component in the same
mold as `CategorySearch`/`CategoryMenu` (see
[blog.md](blog.md#presentation)): it owns its own field state via
`useState` and emits a plain `PostFormValues` object (including the
raw `File | null`) through `onSubmit` — slug auto-derives from the
title (kebab-cased) until the slug field itself is edited directly,
`publishedAt` defaults to today, and the category input reads existing
categories from `useCategoriesState()` (reused from `blog`) as a
`<datalist>` for convenience, not enforcement — any category string is
still valid, matching `Category`'s own lack of a fixed enum.

**`usePublishPostState`** follows the exact shape from
[08-tech-preact-typescript.md](../08-tech-preact-typescript.md#presentation-a-thin-adapter-over-the-state-services-signal):
pulls `PublishPostStateService` from `container`, returns `.state.value`
and a `publishPost(command)` passthrough. No `useEffect` — unlike
`usePostsPageState`/`useAuthState`, there's nothing to load on mount,
only a command to dispatch on submit.

**`DashboardContainer`** is now a thin adapter, not an orchestrator: it
builds a `PublishPostCommand` from the form's raw values and calls
`publishPost()`, passing `publish.status === 'submitting'` straight to
`PostForm`'s `submitting` prop. No `container.get()` calls, no
try/catch, no manual upload-then-create sequencing, no direct
`NotificationStateService` usage — all of that moved into
`PublishPostCommandHandler`/`PublishPostStateService` above. This is
the change this doc exists to record: an earlier version of this
module put that orchestration directly in the container; it's
application-layer logic (sequencing two side effects, deciding what
counts as a valid submission), so it belongs in application, not
presentation, the same rule [03-application-layer-cqrs.md](../03-application-layer-cqrs.md)
states for every other module in this codebase.

## DI wiring

Bound in [`composition-root.ts`](../../src/composition-root.ts):
`PostImageUploader` → `FirebasePostImageUploader` (bound independently,
no dependency on `PostRepository` or vice versa) → `PublishPostStateService`
(composes a `PublishPostCommandHandler` built from `PostImageUploader` +
`blog`'s `PostWriteService`, plus `NotificationStateService` +
`ErrorManager` directly). New symbol in
[`shared/di/types.ts`](../../src/shared/di/types.ts):
`PublishPostStateService` (`PostImageUploader` already existed as a
symbol — only its binding's import path moved, from `blog`'s adapters
to `dashboard`'s).

## Tests

```
application/
  command/__tests__/   PublishPost.commandHandler.test.ts (mocked PostImageUploader + PostWriteService)
  __tests__/            PublishPost.stateService.test.ts (mocked handler + NotificationStateService + ErrorManager)
```

`PublishPost.commandHandler.test.ts` asserts the happy path (upload
runs, its resolved URL ends up as `CreatePostCommand.image`, captured
via `ts-mockito`'s `capture()`) and that a missing file throws
`MissingPostImageError` *without* calling either the uploader or
`PostWriteService.createPost()` — the ordering/short-circuit guarantee
that was previously untested inline `if` logic in the container.
`PublishPost.stateService.test.ts` asserts the `submitting` →
`submitted` transition and the success notification on success, and
the reset-to-`idle` + `ErrorManager.handle()` call (not a direct
notification) on failure.

`PostForm`/`DashboardContainer` have no dedicated tests — presentation
isn't unit-tested in this app, see
[07-testing-strategy.md](../07-testing-strategy.md#presentation-is-not-unit-tested).
`PolicyService`/`AuthStateService`, which the guarded route and the
logout button depend on, are tested where they're actually defined —
see [shared-policies.md](shared-policies.md#tests),
[shared-auth.md](shared-auth.md#tests).
