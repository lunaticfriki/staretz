# Module: Dashboard

The private admin area for managing blog posts: list them, write a new
one, edit an existing one, delete one. Unlike [about.md](about.md), it
earns the full four-layer shape: it has a real domain port of its own
(`PostImageUploader`) and real orchestration concerns (upload the image,
*then* create/update the post) that belong in application-layer command
handlers, not in a container.

## Routes

| Path | Container | Guarded by |
|---|---|---|
| `/dashboard` | `PostsListContainer` | `DASHBOARD_ACCESS_POLICY` (see below) |
| `/dashboard/new` | `NewPostContainer` | `DASHBOARD_ACCESS_POLICY` |
| `/dashboard/edit/:slug` | `EditPostContainer` | `DASHBOARD_ACCESS_POLICY` |

Each registered as its own `RequirePolicy`-wrapped route in
[`app.tsx`](../../src/app.tsx) — see
[shared-policies.md](shared-policies.md#presentation) for how the guard
works. `/login` (`LoginPage`, unguarded) is the redirect target when the
policy fails. `/dashboard` is the management home (the list); creating
and editing are separate screens rather than modals or inline table
rows, the same "one screen, one concern" shape the rest of this app's
routing uses.

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
raw URL is handed to `blog`'s `CreatePostCommand`/`UpdatePostCommand`
(themselves bags of primitives) one layer up, in this module's own
application handlers (see [Application](#application) below). `File`
(the browser API type) appearing in a domain port is the one place
this module's domain layer touches a presentation-adjacent type, for
the same reason `blog`'s `Post.repository.ts` doesn't need to:
uploading is a distinct technical operation from persisting a `Post`,
so it gets its own port rather than `PostRepository.save()`/`update()`
growing a `File` parameter they don't otherwise need. One upload port
serves both create and edit — nothing about it is create-specific.

**`MissingPostImageError`** (`extends DomainError`) is thrown by
`PublishPostCommandHandler` when creating a post with no file selected
— see
[01-domain-layer.md](../01-domain-layer.md#domain-errors-and-warnings-live-in-the-domain-not-the-application-layer)
for why this type lives in domain even though application is what
detects and throws it. In practice the `<input type="file" required>`
in `PostForm` already stops the browser from submitting without a
file when creating; this is defense-in-depth at the orchestration
boundary, not the primary guard. Editing has no equivalent error — a
missing file there just means "keep the current image," a valid choice
rather than a mistake (see `EditPostCommandHandler` below).

**`dashboardPolicy.ts`** is the one non-layered file: it exports
`DASHBOARD_ACCESS_POLICY = PolicyName.create('dashboard:access')`, the
single source of truth for that string, imported by both `app.tsx`
(to guard all three routes) and `composition-root.ts` (to register
which `Policy` answers for it). It's a plain, kind-suffix-less file —
the same exemption `RouteProps.ts`/`composition-root.ts` get in
[06-vertical-slicing.md](../06-vertical-slicing.md#file-naming-convention),
for a constant rather than a class hierarchy.

## Application

```
src/modules/dashboard/application/
  command/
    PublishPost.command.ts
    PublishPost.commandHandler.ts
    EditPost.command.ts
    EditPost.commandHandler.ts
    __tests__/
      PublishPost.commandHandler.test.ts
      EditPost.commandHandler.test.ts
  PostManagement.stateService.ts
  __tests__/
    PostManagement.stateService.test.ts
```

There's no `DeletePost.command.ts`/`commandHandler.ts` here — deleting
has zero orchestration of its own (no upload, no field validation
beyond what `blog`'s own `DeletePostCommandHandler` already does), so
`PostManagementStateService.deletePost()` below calls straight into
`blog`'s `PostWriteService.deletePost()`. A command/handler pair earns
its place by encapsulating real sequencing or decisions
([03-application-layer-cqrs.md](../03-application-layer-cqrs.md),
"CQRS, no use cases" — not "a class for every verb regardless of
whether it does anything").

**`PublishPostCommand`**: raw primitives (`slug`, `title`, `excerpt`,
`content`, `author`, `category`, `publishedAt` — all `string`) plus
`imageFile: File | null` — the one field `blog`'s `CreatePostCommand`
doesn't have, because uploading it is this module's job, not `blog`'s.

**`PublishPostCommandHandler`**: `1)` if `command.imageFile` is `null`,
throws `MissingPostImageError` immediately — no upload attempted; `2)`
`PostImageUploader.upload(command.imageFile)` resolves to a real URL;
`3)` builds `blog`'s `CreatePostCommand` (with that URL as `image`) and
calls `PostWriteService.createPost()` ([blog.md](blog.md#application)).

**`EditPostCommand`**: the same primitives as `PublishPostCommand`
minus `slug` isn't editable — it's still there (identifying which post
to update) but `PostForm` renders it read-only in edit mode (see
[Presentation](#presentation) below) — plus `currentImage: string`
(the post's existing image URL) alongside `imageFile: File | null`
(an optional replacement).

**`EditPostCommandHandler`**: `1)` `command.imageFile ? await
imageUploader.upload(command.imageFile) : command.currentImage` — a
new file re-uploads and replaces the image; no file keeps the existing
URL as-is, no upload attempted; `2)` builds `blog`'s `UpdatePostCommand`
(with that resolved URL) and calls `PostWriteService.updatePost()`
([blog.md](blog.md#application)).

Both handlers are the sanctioned cross-module shape from
[06-vertical-slicing.md](../06-vertical-slicing.md#rules): `dashboard`'s
application depends on `blog`'s *application* layer (`PostWriteService`,
a port-like abstract class), never on `blog`'s domain or infrastructure
directly — `dashboard` doesn't know `CreatePostCommandHandler`,
`UpdatePostCommandHandler`, or `PostRepository` exist. If an image
upload fails, neither `createPost()` nor `updatePost()` is ever
called — no orphaned/corrupted post from a half-finished submission.

**`PostManagementStateService`** — the only file in this module
depending on `@preact/signals-core`, same rule as `blog`'s
`Post.stateService.ts` ([blog.md](blog.md#application)). Three signals,
one per action, the same "multiple related signals in one service"
shape `PostStateService` uses for its three reads
([blog.md](blog.md#application)) — publishing, editing, and deleting
share the same two dependencies (`NotificationStateService` +
`ErrorManager`) and the same lifecycle shape, so they're one service
rather than three near-identical ones:

- `publish: Signal<PublishPostState>` (`idle | submitting | submitted`)
  + `publishPost(command)`.
- `edit: Signal<EditPostState>` (`idle | submitting | submitted`) +
  `editPost(command)`.
- `delete: Signal<DeletePostState>` (`idle | deleting { slug } |
  deleted { slug }`) + `deletePost(slug)`. Carrying `slug` in the
  `deleting`/`deleted` variants (not just a boolean) is what lets
  `PostsTable` show a spinner on the *one row* being deleted rather
  than disabling the whole table.

All three methods follow the same shape: set the "in flight" state,
call the relevant command handler (or, for delete, `blog`'s
`PostWriteService.deletePost()` directly), and on success set the
terminal state and call `NotificationStateService.notify('success',
...)`; on failure, reset to `idle` and route the error through
`ErrorManager` ([shared-errors.md](shared-errors.md)) — the same
pattern `PostStateService.loadPosts()`/`loadCategories()` use
([blog.md](blog.md#application)), rather than calling
`NotificationStateService.notify('error', ...)` directly. `submitted`/
`deleted` are terminal signals, not auto-reset to `idle` — the
containers that watch them decide what to do next (see
[Presentation](#presentation) below).

## Infrastructure

```
src/modules/dashboard/infrastructure/
  FirebasePostImageUploader.repository.ts
  FakePostImageUploader.repository.ts
  storage.ts
```

Unchanged by this feature — one upload port, one pair of adapters,
shared by both the create and edit flows. **`FirebasePostImageUploader`**
is the `PostImageUploader` adapter bound in `composition-root.ts`:
`upload(file)` writes to Cloud Storage at `posts/<timestamp>-<filename>`
via `uploadBytes()`, then resolves the public URL via
`getDownloadURL()`. Uses `storage.ts` (`getStorage(firebaseApp)`, same
one-line pattern as `blog`'s `firestore.ts` — see
[blog.md](blog.md#infrastructure)) and the *full* `firebase/storage`
import (no lite variant exists for Storage, unlike Firestore).
**`FakePostImageUploader`** is its in-memory-development counterpart:
`URL.createObjectURL(file)` returns a local blob URL good for the
current browser session only — no real upload, no network call, pairs
with `blog`'s `FakePostRepository` for offline development. Swapping
between them is the same one-line `composition-root.ts` change as any
other port
([04-infrastructure-layer.md](../04-infrastructure-layer.md#one-implementation-per-port-swappable)).

## Presentation

```
src/modules/dashboard/presentation/
  containers/
    PostsList.container.tsx
    NewPost.container.tsx
    EditPost.container.tsx
  components/
    DashboardNav.component.tsx
    PostForm.component.tsx
    PostsTable.component.tsx
  usePostManagementState.hook.ts
```

**`DashboardNav`**: the pure, shared nav strip ("Articles" /
"Nou article" / "Tanca sessió") all three screens render at the top —
avoids repeating the same three links/button three times, the
lightweight equivalent of `blog`'s `PostGrid` being shared by
`HomeContainer`/`CategoryPageContainer`
([blog.md](blog.md#presentation)). No routing/layout nesting involved:
each container just renders `<DashboardNav onLogout={logout} />` as
its first child.

**`PostForm`** is a self-contained, pure-ish component in the same
mold as `CategorySearch`/`CategoryMenu` (see
[blog.md](blog.md#presentation)): it owns its own field state via
`useState` and emits a plain `PostFormValues` object (including the
raw `File | null`) through `onSubmit`. It now serves both create and
edit through props rather than being two components:

- `initialValues?: Omit<PostFormValues, 'imageFile'>` — when given
  (edit mode), pre-fills every text field and marks the slug as
  already "touched" so title edits don't clobber it via
  auto-derivation; when absent (create mode), fields start empty and
  slug auto-derives from the title (kebab-cased) until edited directly.
- `currentImage?: string` — when given, renders a small thumbnail
  ("Imatge actual — deixa-ho en blanc per mantenir-la") above the file
  input and makes the file input optional (`required={!currentImage}`);
  when absent, the file input stays required, unchanged from before
  this feature.
- `slugEditable = true` — `EditPostContainer` passes `false`: the slug
  is the routing identity (`/blog/:slug`, `/dashboard/edit/:slug`) and
  changing it out from under a live URL isn't supported, so the field
  renders `disabled` rather than silently allowing an edit that
  wouldn't do anything useful (`EditPostCommand.slug` is always the
  slug the screen was loaded with, never read back from the form).
- `submitLabel`/`submittingLabel` — cosmetic only ("Publica"/
  "Publicant..." vs. "Desa els canvis"/"Desant...").

**`PostsTable`**: pure component, props `{ posts, deletingSlug,
onDelete }`. Renders a row per post (title/category/published date)
with an "Edita" link to `/dashboard/edit/<slug>` and an "Elimina"
button; the button disables and reads "Eliminant..." only for the row
matching `deletingSlug`, not the whole table, using the `slug` carried
on `PostManagementStateService.delete`'s `deleting` variant. No
knowledge of *how* delete works — `onDelete(slug)` is a plain
callback, same shape as `PostGrid`'s `onPageChange`
([blog.md](blog.md#presentation)).

**`usePostManagementState`** follows the exact shape from
[08-tech-preact-typescript.md](../08-tech-preact-typescript.md#presentation-a-thin-adapter-over-the-state-services-signal):
pulls `PostManagementStateService` from `container`, returns
`.publish`/`.edit`/`.delete` `.value`s and `publishPost`/`editPost`/
`deletePost` passthroughs. No `useEffect` — unlike
`usePostsPageState`/`useAuthState`, there's nothing to load on mount,
only commands to dispatch on submit/click.

**`NewPostContainer`** (`/dashboard/new`, the renamed former
`DashboardContainer`): builds a `PublishPostCommand` from the form's
raw values and calls `publishPost()`, passing `publish.status ===
'submitting'` straight to `PostForm`'s `submitting` prop. No
`container.get()` calls, no try/catch, no manual upload-then-create
sequencing — all of that lives in `PublishPostCommandHandler`/
`PostManagementStateService` above, the change
[an earlier revision of this doc](#application) already recorded: an
even earlier version of this module put that orchestration directly in
the container, which is application-layer logic and belongs in
application, per [03-application-layer-cqrs.md](../03-application-layer-cqrs.md).

**`EditPostContainer`** (`/dashboard/edit/:slug`): reuses `blog`'s own
`usePostBySlugState(slug)` hook to load the post being edited — the
exact same hook `PostPageContainer` uses for the public reading view
([blog.md](blog.md#presentation)) — rendering `loading`/`not-found`/
`loaded` branches, and only mounts `<PostForm>` once `loaded`, passing
`initialValues`/`currentImage` built from the domain `Post`. On submit,
builds an `EditPostCommand` (carrying the still-loaded post's current
image as the fallback) and calls `editPost()`. A `useEffect` watching
`edit.status === 'submitted'` calls `route('/dashboard')` — navigating
back to the list is this container's own view-level decision
(routing is a browser/router concern), not something the state service
or command handler needs to know about.

**`PostsListContainer`** (`/dashboard`): reuses `blog`'s own
`usePostsPageState(page, perPage, search, refreshToken)` hook —
identical to `HomeContainer`'s, just with a management-sized page size
(10) and no search term. The fourth parameter, `refreshToken`, is new:
a plain local `useState(0)` counter, added to the hook's effect
dependency array (see [blog.md](blog.md#presentation)) purely so this
screen can force a refetch of the *same* page after a mutation the
public blog never triggers — bumping it after a successful delete is
what makes the row disappear from the table without a full reload.
Deleting asks for confirmation via a native `window.confirm()` before
calling `deletePost(slug)` — a lightweight, dependency-free guard
against an accidental click on a destructive, irreversible action.

## DI wiring

Bound in [`composition-root.ts`](../../src/composition-root.ts):
`PostImageUploader` → `FirebasePostImageUploader` (bound independently,
no dependency on `PostRepository` or vice versa) → 
`PostManagementStateService` (composes a `PublishPostCommandHandler`
and an `EditPostCommandHandler`, both built from `PostImageUploader` +
`blog`'s `PostWriteService`, plus `blog`'s `PostWriteService` again
directly for `deletePost()`, plus `NotificationStateService` +
`ErrorManager`). New symbol in
[`shared/di/types.ts`](../../src/shared/di/types.ts):
`PostManagementStateService` (replacing the narrower
`PublishPostStateService` symbol from before this feature;
`PostImageUploader` itself is unchanged).

## Tests

```
application/
  command/__tests__/   PublishPost.commandHandler.test.ts (mocked PostImageUploader + PostWriteService)
                        EditPost.commandHandler.test.ts (mocked PostImageUploader + PostWriteService)
  __tests__/            PostManagement.stateService.test.ts (mocked handlers + PostWriteService + NotificationStateService + ErrorManager)
```

`PublishPost.commandHandler.test.ts` asserts the happy path (upload
runs, its resolved URL ends up as `CreatePostCommand.image`, captured
via `ts-mockito`'s `capture()`) and that a missing file throws
`MissingPostImageError` *without* calling either the uploader or
`PostWriteService.createPost()`. `EditPost.commandHandler.test.ts`
asserts both branches: no file selected reuses `currentImage` and
never calls the uploader; a file selected uploads it and uses the
resolved URL, in both cases captured off `PostWriteService.updatePost()`'s
argument. `PostManagement.stateService.test.ts` asserts, for each of
`publishPost`/`editPost`/`deletePost`, the in-flight → terminal state
transition, the success notification, and the reset-to-`idle` +
`ErrorManager.handle()` call (not a direct notification) on failure —
`deletePost()`'s assertions additionally check the `slug` carried on
the `deleting`/`deleted` signal values.

`PostForm`/`PostsTable`/`DashboardNav`/the three containers have no
dedicated tests — presentation isn't unit-tested in this app, see
[07-testing-strategy.md](../07-testing-strategy.md#presentation-is-not-unit-tested).
`PolicyService`/`AuthStateService`, which the guarded routes and the
logout button depend on, are tested where they're actually defined —
see [shared-policies.md](shared-policies.md#tests),
[shared-auth.md](shared-auth.md#tests). `blog`'s own
`UpdatePostCommandHandler`/`DeletePostCommandHandler` (what
`EditPostCommandHandler`/`deletePost()` ultimately call into) are
tested in [blog.md](blog.md#tests), not here.
