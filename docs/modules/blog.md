# Module: Blog

The blog itself — the home page's paginated, filterable list of posts,
the category browsing/search pages, and the individual post reading
view. The reference implementation of the full domain → application →
infrastructure → presentation shape in this codebase; read this
alongside [01](../01-domain-layer.md)–[05](../05-presentation-layer.md)
to see the general rules made concrete.

## Routes

| Path | Container |
|---|---|
| `/` | `HomeContainer` |
| `/blog/:slug` | `PostPageContainer` |
| `/category/:term` | `CategoryPageContainer` |

Registered in [`app.tsx`](../../src/app.tsx).

## Domain

```
src/modules/blog/domain/
  entities/
    Post.entity.ts
  collections/
    Post.collection.ts
    Category.collection.ts
  value-objects/
    Slug.valueObject.ts
    PostTitle.valueObject.ts
    PostExcerpt.valueObject.ts
    PostContent.valueObject.ts
    PostAuthor.valueObject.ts
    PublishedAt.valueObject.ts
    Category.valueObject.ts
    PostImage.valueObject.ts
  repositories/
    Post.repository.ts
  errors/
    PostNotFound.error.ts
```

**`Post`** is a read-only entity — every field `public readonly`, no
behavior methods — built through `Post.create(...)`/`Post.empty()`. Its
eight fields are all value objects, never primitives: `slug` (`Slug`,
lowercase-kebab-case, validated by regex), `title`/`excerpt`/`content`/
`author`/`category`/`image` (each a non-empty-string wrapper with its own
`InvalidXxxError`), `publishedAt` (`PublishedAt`, wraps a `Date`, exposes
`isAfter()` for ordering and `toDate()`/`toISOString()` — never a bare
`Date` escapes the value object).

**`Category`** is a plain non-empty-string wrapper (same shape as
`PostAuthor`) — `create(value)` trims and rejects empty,
`equals()` compares case-insensitively. It does not know about slugs or
URLs; the category-page route encodes the display value directly (see
[Presentation](#presentation) below) rather than introducing a second
"slug" concept for what's already a short, human-readable string.

**`PostImage`** is the same non-empty-string-wrapper shape again, holding
one image URL — the post's hero/preview image is domain data now, not a
value presentation computes on the fly. Both ACL mappers populate it (see
[Infrastructure](#infrastructure) below): a data source that has a real
authored image sets it directly; one that doesn't (today, the markdown
seed data) gets a deterministic placeholder generated *at the
infrastructure boundary*, so the domain and presentation layers only
ever see "this post has an image at this URL," never "this post might
need a fallback." A single URL is stored, not a per-size set — `object-cover`
handles both the small preview-card crop and the full-bleed hero from
the one image, so there was nothing to gain from storing width/height
variants.

**`PostCollection`** (`domain/collections/`) wraps `Post[]` and owns the
collection-level domain behavior this module has:

- `sortedByMostRecent()` (uses `PublishedAt.isAfter()`, returns a new
  `PostCollection`, immutable like a value object).
- `filterByCategory(criteria: SearchCriteria): PostCollection` — keeps
  posts where `criteria.matches(post.category.toString())`, using the
  generic `SearchCriteria` primitive from
  [shared-search.md](shared-search.md). An empty criteria matches
  everything, so this doubles as "no filter."
- `categories(): CategoryCollection` — the distinct categories across
  every post in the collection (deduplicated case-insensitively), sorted
  alphabetically.
- `paginate(criteria: PaginationCriteria): Page<Post>` — slices the
  collection at `criteria.offset` for `criteria.perPage` items and
  reports the collection's full length as `totalItems`, using the
  generic `PaginationCriteria`/`Page` primitives from
  [shared-pagination.md](shared-pagination.md).

All four return a new value rather than mutating. `toArray()` remains
the one sanctioned exit to a plain array for any future direct consumer
of `PostCollection` — domain and application code never touch `Post[]`
directly. `paginate()`'s own output already exposes `Page.items` as a
plain array (a generic, already-read-only envelope, not a collection
hiding an invariant), so presentation reads `Page.items` straight off
without an extra `toArray()` step. See
[01-domain-layer.md](../01-domain-layer.md#folder-structure-within-the-domain-layer)
for when a collection is worth introducing over a plain array.

**`CategoryCollection`** (`domain/collections/`) wraps `Category[]` —
the result of `PostCollection.categories()` — and owns the one piece of
collection-level behavior *it* has: `matching(criteria: SearchCriteria):
CategoryCollection`, keeping categories whose name matches the criteria.
This is what powers the header search box's live suggestions and its
Enter-to-resolve behavior (see [Presentation](#presentation) below) —
the actual filtering algorithm lives here, in the domain, not as a
`.filter()` call inside `CategorySearch.component.tsx`. Same immutable/
`toArray()` shape as `PostCollection`.

**`PostRepository`** (port, `abstract class`) declares
`findAll(): Promise<PostCollection>`,
`findBySlug(slug: Slug): Promise<Post | null>`, and
`save(post: Post): Promise<void>` — domain knows nothing about markdown
files, Firestore, or `import.meta.glob`. Filtering and category listing
are both derived from `findAll()` in the application layer (see below),
not separate repository methods — there's no persistence concern that
would justify pushing them down into the port. `save()` is the one
write method the port has; there's no `update()`/`delete()` yet because
nothing in the app needs them — see
[dashboard.md](dashboard.md) for the one place `save()` is actually
called from. Uploading the image file that becomes `PostImage.create(...)`'s
argument is a separate technical capability (`PostImageUploader`) that
now lives in `dashboard`'s own domain, not here — see
[dashboard.md](dashboard.md#domain) for why.

**`PostNotFoundError`** (`extends DomainError`) is thrown by the query
handler below when a slug doesn't resolve — see
[01-domain-layer.md](../01-domain-layer.md#domain-errors-and-warnings-live-in-the-domain-not-the-application-layer)
for why this type lives in domain even though application is what throws
it. It's *not* routed through `ErrorManager` — a bad slug is expected
navigation, not a real failure, and `PostPageContainer` renders
`PostNotFound` locally instead.

## Application

```
src/modules/blog/application/
  query/
    ListPosts.query.ts
    ListPosts.queryHandler.ts
    ListCategories.query.ts
    ListCategories.queryHandler.ts
    GetPostBySlug.query.ts
    GetPostBySlug.queryHandler.ts
  command/
    CreatePost.command.ts
    CreatePost.commandHandler.ts
    __tests__/
      CreatePost.commandHandler.test.ts
  Post.readService.ts
  Post.writeService.ts
  Post.stateService.ts
```

Three query handlers and one command handler — the blog was read-only
until the [dashboard](dashboard.md) module needed a way to publish new
posts.

- **`ListPostsQueryHandler`**: takes a `ListPostsQuery { pagination:
  PaginationCriteria, search: SearchCriteria }`, does `findAll()` then
  `.filterByCategory(query.search).sortedByMostRecent().paginate(query.pagination)`
  — filter, sort, and paginate each live on `PostCollection`
  ([shared-search.md](shared-search.md),
  [shared-pagination.md](shared-pagination.md)), the handler just
  sequences the calls and returns the resulting `Page<Post>`. Filtering
  runs before sorting/pagination so `totalItems`/`totalPages` on the
  returned `Page` already reflect the filtered set.
- **`ListCategoriesQueryHandler`**: takes an empty `ListCategoriesQuery`
  (kept as a real type purely so `listCategories()` has the same
  query-object calling convention as every other read — see
  [03-application-layer-cqrs.md](../03-application-layer-cqrs.md)),
  does `findAll()` then `.categories()`.
- **`GetPostBySlugQueryHandler`**: `Slug.create(query.slug)` then
  `findBySlug`; throws `PostNotFoundError` if `null`.
- **`CreatePostCommandHandler`**: takes a `CreatePostCommand` of raw
  primitives (`slug`, `title`, `excerpt`, `content`, `author`,
  `category`, `publishedAt`, `image` — all `string`), builds a `Post`
  through the exact same value-object factories every ACL mapper uses
  (`Slug.create(command.slug)`, `PostImage.create(command.image)`,
  etc.), then `posts.save(post)`. Domain validation is enforced here
  the same way it is anywhere else a `Post` gets constructed — an
  invalid category or empty title throws before `save()` is ever
  called. This handler knows nothing about image uploads or `File`s;
  by the time `dashboard`'s `PublishPostCommandHandler` calls
  `createPost()`, the image has already been uploaded and reduced to a
  plain URL string — see [dashboard.md](dashboard.md#application) for
  that orchestration.
- **`PostReadService`**: zero library dependencies, wraps all three
  query handlers behind `listPosts()`/`getBySlug()`/`listCategories()`.
  Because `Post`/`CategoryCollection` are read-only, every method
  returns the domain type directly (`Page<Post>`/`Post`/
  `CategoryCollection`) — no `Post.readModel.ts` DTO — see
  [05-presentation-layer.md](../05-presentation-layer.md#read-models-are-optional--presentation-may-render-a-domain-entity-directly).
- **`PostWriteService`**: the read/write split
  [03-application-layer-cqrs.md](../03-application-layer-cqrs.md#read-and-write-services-are-separated)
  describes — a distinct dependency surface from `PostReadService`, zero
  library dependencies, currently one method,
  `createPost(command): Promise<void>`, wrapping
  `CreatePostCommandHandler`. Nothing reads through it; nothing writes
  through `PostReadService`.
- **`PostStateService`**: the only file here depending on
  `@preact/signals-core`. Three signals: `postsPage` (`PostsPageState` —
  `loading | loaded (Page<Post>) | error`), `postBySlug`
  (`PostBySlugState` — `loading | loaded (Post) | not-found`), and
  `categories` (`CategoriesState` — `loading | loaded
  (CategoryCollection) | error`). `loadPosts`/`loadCategories` report
  genuine failures to `ErrorManager` ([shared-errors.md](shared-errors.md));
  `loadBySlug` deliberately does not — see the `PostNotFoundError` note
  above.

## Infrastructure

```
src/modules/blog/infrastructure/
  FakePost.repository.ts
  FirebasePost.repository.ts
  firestore.ts
  acl/
    Post.mapper.ts
    markdownFrontmatter.util.ts
    FirestorePost.mapper.ts
    postImagePlaceholder.util.ts
    __tests__/
      Post.mapper.test.ts
      FirestorePost.mapper.test.ts
```

**`FirebasePostRepository`** is the `PostRepository` adapter currently
bound in `composition-root.ts` — production reads from and writes to
Cloud Firestore. `firestore.ts` calls `getFirestore(firebaseApp)` once
and exports the `firestore` instance, where `firebaseApp` comes from
`src/shared/firebase/firebaseApp.ts` — the Firebase App bootstrap
itself lives in `shared/` (not here) because `shared/auth` needs the
same app instance too; see
[shared-auth.md](shared-auth.md#infrastructure) for why it moved.
`VITE_FIREBASE_*` env vars (see `.env.example` at the repo root; never
hardcoded, never committed — `.env*` is gitignored) configure it. The
repository reads/queries/writes the **`posts`** collection: `findAll()`
is `getDocs(collection(firestore, 'posts'))`; `findBySlug()` is a
*query* — `getDocs(query(collection(firestore, 'posts'), where('slug',
'==', slug), limit(1)))` — not a direct document read, because the
Firestore document id is **not** the slug (documents get
Firestore-assigned random ids; `slug` is its own field like every other
field); `save()` is `addDoc(collection(firestore, 'posts'),
FirestorePostMapper.toPersistence(post))`.

Every Firestore import in this file, `firestore.ts`, and
`FirestorePost.mapper.ts` comes from **`firebase/firestore/lite`**, not
the full `firebase/firestore` — this app only ever does one-time reads/
writes (`getDoc`/`getDocs`/`addDoc`), never `onSnapshot` real-time
listeners or offline persistence, and the lite build drops all of that
machinery. It cut the production bundle from ~650KB to ~289KB minified.
If a future feature genuinely needs live updates or offline support,
that's the trigger to switch back to the full `firebase/firestore`
import — not a default to reach for pre-emptively.

Uploading a post's image file is no longer this module's concern —
`PostImageUploader` and its adapters live in `dashboard`'s own
domain/infrastructure now; see [dashboard.md](dashboard.md#infrastructure).

**`FakePostRepository`** is a second `PostRepository` adapter — the
original one, kept in the codebase as the in-memory alternative: despite
the "Fake" name (a holdover from when it was test-only),
`import.meta.glob('/src/data/posts/*.md', ...)` eagerly loads every file
under [`src/data/posts/`](../../src/data/posts/) at build time, mapped
through the ACL into `Post` entities held in memory — no network calls,
useful for offline development or if Firestore is ever unreachable. This
is the "one implementation per port, swappable" case from
[04-infrastructure-layer.md](../04-infrastructure-layer.md#one-implementation-per-port-swappable):
neither `PostReadService` nor anything above it changes when the binding
switches. Swapping back is the one-line change in `composition-root.ts`:
`new FirebasePostRepository()` → `new FakePostRepository()`.

**`markdownFrontmatter.util.ts`** splits a raw `.md` file into
`{ frontmatter, body }` by regex-matching the leading `---`-delimited
block. **`PostMapper.toDomain(raw)`** takes that output and constructs a
`Post` through its factories (`Slug.create(frontmatter.slug)`,
`Category.create(frontmatter.category)`, etc.) — this is the
Anti-Corruption Layer: markdown/frontmatter vocabulary never leaks past
this file. See
[04-infrastructure-layer.md](../04-infrastructure-layer.md#the-anti-corruption-layer-acl).

**`postImagePlaceholder.util.ts`** (`postImagePlaceholderUrl(seed, width
= 1200, height = 800)`) builds a deterministic
`https://picsum.photos/seed/<seed>/<w>/<h>` URL — the same seed always
gets the same photo. Both ACL mappers below fall back to it when their
data source doesn't provide a real image, seeding it with the post's
slug so the placeholder is stable across reloads without being stored
anywhere.

**`PostMapper.toDomain(raw)`** sets `image: PostImage.create(frontmatter.image
|| postImagePlaceholderUrl(frontmatter.slug))` — none of today's seed
markdown files set an `image:` field, so every seeded post currently gets
the generated placeholder; a post *could* set one and the mapper would
use it as-is.

**`FirestorePostMapper.toDomain(data)`** is `FirebasePostRepository`'s
ACL — a second, independent translator for the same `Post` domain shape,
proof that the domain has no idea markdown or Firestore exist. Every
field, including `slug`, is read straight off `data` through the same
value-object factories `PostMapper` uses — the Firestore document id is
**not** used as the slug (an earlier version of this mapper assumed that;
real documents here have Firestore-assigned random ids with `slug` as
its own field, same as `title`/`author`/etc.), including the same
`data.image || postImagePlaceholderUrl(data.slug)` fallback. The one
piece of real translation logic beyond that: `data.publishedAt` is a
Firestore `Timestamp` in production, converted via `.toDate()` before
reaching `PublishedAt.create()` (which also accepts a plain `Date`/ISO
string, so the mapper degrades gracefully if a document ever stores a
string instead).

Because the slug isn't the document id, `FirebasePostRepository.findBySlug()`
is a query (`where('slug', '==', slug)`, `limit(1)`), not a direct
document read — see [Infrastructure](#infrastructure) above.

Expected Firestore document shape, collection `posts` (document id is
whatever Firestore assigns — irrelevant to the domain):

```
slug: "hexagonal-architecture-explained"
title: "Hexagonal Architecture Explained"
excerpt: "A short summary shown in the preview card."
content: "Markdown body, rendered through `marked` in PostView."
author: "Marco Reyes"
publishedAt: Timestamp(2026-01-19)
category: "Architecture"
image: "https://cdn.example.com/hexagonal-architecture.jpg"  # optional — falls back to a placeholder if absent
```

Post frontmatter shape (see any file in `src/data/posts/`):

```markdown
---
slug: hexagonal-architecture-explained
title: Hexagonal Architecture Explained
excerpt: A short summary shown in the preview card.
author: Marco Reyes
publishedAt: 2026-01-01
category: Architecture
image: https://cdn.example.com/hexagonal-architecture.jpg  # optional — falls back to a placeholder if absent
---

Markdown body, rendered through `marked` in `PostView`.
```

Every seeded post carries one of five categories (`Architecture`,
`Domain-Driven Design`, `Frontend`, `Testing`, `Tooling`) — chosen per
post to match its actual subject, not evenly distributed for its own
sake.

## Presentation

```
src/modules/blog/presentation/
  containers/
    Home.container.tsx
    CategoryPage.container.tsx
    PostPage.container.tsx
  components/
    PostGrid.component.tsx
    PostPreview.component.tsx
    PostPreview.skeleton.tsx
    CategoryMenu.component.tsx
    CategorySearch.component.tsx
    PostView.component.tsx
    PostView.skeleton.tsx
    PostNotFound.component.tsx
  usePostsPageState.hook.ts
  usePostBySlugState.hook.ts
  useCategoriesState.hook.ts
  formatPublishedAt.util.ts
```

**`PostGrid`** is the pure, shared rendering piece both list screens use:
props `{ totalItems, items, page, totalPages, onPageChange,
emptyMessage }`. It renders the "Nombre de posts: N" count, either the
`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` of `PostPreview` cards
or `emptyMessage` when `items` is empty (a category/search with no
matches), and `<Pagination>` underneath
(`shared/presentation/Pagination.component.tsx`, see
[shared-pagination.md](shared-pagination.md)) — a plain controlled
component, no knowledge of `Post` beyond what's in its props.

**`HomeContainer`**: holds the one piece of local UI state this module
has per screen — `const [page, setPage] = useState(1)` — the currently
selected page number. This isn't application state (it doesn't survive a
reload, isn't shared with any other screen); it's exactly the kind of
ephemeral, view-only state a container is allowed to hold directly, the
same way `SplashScreen` holds its own fade timer (see
[shared-theme.md](shared-theme.md) for the equivalent local-state
precedent). `usePostsPageState(page, POSTS_PER_PAGE)` (`POSTS_PER_PAGE =
5`, `search` left at its default `''`) re-queries whenever `page`
changes and branches on `status`: `loading` renders 5
`PostPreviewSkeleton`s in the same grid `PostGrid` uses (so nothing
jumps), `error` renders the message, `loaded` hands `state.page.items`/
`state.page.page`/`state.page.totalItems`/`state.page.totalPages`
straight to `<PostGrid>`.

**`CategoryPageContainer`** (`/category/:term`): same shape as
`HomeContainer` — its own `[page, setPage]` state — but calls
`usePostsPageState(page, POSTS_PER_PAGE, decodeURIComponent(term))`,
passing the route param through as the search term, and renders a
`Categoria: {term}` heading above the same loading/error/loaded branches
into `<PostGrid>`, with an empty-state message naming the term when
nothing matches. This is the single destination for *both* ways of
filtering by category — see [shared-search.md](shared-search.md#why-the-click-and-the-search-box-are-the-same-mechanism)
for why a dropdown click and a typed search both just navigate here with
a different `:term`.

**`CategoryMenu`**: the header's "Categories ▾" dropdown.
`useCategoriesState()` loads the distinct category list once; each entry
links to `/category/<exact category, URL-encoded>`. Open/closed is its
own local `useState`, closed on an outside click (a `document` click
listener added only while open) or on selecting an entry — again
ephemeral view state that has no business living in a state service.

**`CategorySearch`**: the header's free-text input. Holds the typed
value in local `useState`; a debounced (300ms) `useEffect` turns it into
a `SearchCriteria` and calls `categories.matching(criteria)` (the
already-loaded `CategoryCollection` from `useCategoriesState()`) to
render a live suggestions dropdown — the component only owns *when* to
ask (debounce timing, open/closed state) and *how* to render the
answer, never *how matching works*, which stays on `CategoryCollection`
in the domain. On submit (Enter, or clicking a suggestion), it resolves
the same way — `categories.matching(criteria).toArray()[0]` — and
navigates via `route()` (from `preact-router`) to
`/category/<resolved category, URL-encoded>`. This is why typing "fro"
and pressing Enter lands on `/category/Frontend`, not `/category/fro`:
the URL always carries a real matched category name, never the raw
fragment the user typed. No separate search state service — "search"
here *is* just "navigate to the category page with this term," and that
page owns loading the actual results.

**`PostPageContainer`**: `usePostBySlugState(slug)` → `loading` /
`not-found` / `loaded` renders `PostViewSkeleton` / `PostNotFound` /
`PostView` respectively. `PostView` itself owns a full-bleed hero image,
reading `post.image.toString()` straight off the domain entity (see
[Domain](#domain) above — no presentation-layer URL building anymore),
with the reading column (`mx-auto max-w-3xl`) only wrapping the body
content underneath it, not the hero — see
[shared-theme.md](shared-theme.md#layout-is-full-width-reading-pages-recenter-themselves)
for the general full-width-shell-vs-centered-reading-column split this
extends. `PostNotFound`/`PostViewSkeleton` each wrap themselves in
`mx-auto max-w-3xl` directly (no hero, so no reason to break out of the
padded shell).

**`PostView`** renders the post body by piping `post.content.toString()`
through `marked.parse()` into `dangerouslySetInnerHTML` on a
`prose prose-gray ... dark:prose-invert` container (Tailwind Typography),
with `prose-headings:`/`prose-a:` overrides so markdown headings/links
pick up the site's purple accent instead of the plugin's default gray.

**`PostPreview`** uses the same `post.image.toString()` for its card
thumbnail — one URL, two different visual footprints (a `h-40` card crop
vs. the hero's near-full-viewport height), both handled by `object-cover`
rather than by requesting differently-sized images.

All three hooks (`usePostsPageState`, `usePostBySlugState`,
`useCategoriesState`) follow the exact shape from
[08-tech-preact-typescript.md](../08-tech-preact-typescript.md#presentation-a-thin-adapter-over-the-state-services-signal):
pull the state service from `container`, `useEffect` to trigger the
load on mount/param-change, return `.value`. None holds its own
`useState` — the current page number and search term are the
containers' local UI state (see above), passed in as parameters the same
way `usePostBySlugState` already takes `slug` from routing.

## DI wiring

Bound in [`composition-root.ts`](../../src/composition-root.ts), in
dependency order: `PostRepository` → `PostReadService` (composes all
three query handlers) / `PostWriteService` (composes
`CreatePostCommandHandler`) → `PostStateService` (needs
`PostReadService` + `ErrorManager`). Symbols in
[`shared/di/types.ts`](../../src/shared/di/types.ts): `PostRepository`,
`PostReadService`, `PostWriteService`, `PostStateService`. No new
symbols were needed for categories/search —
`ListCategoriesQueryHandler` is constructed inline in
`composition-root.ts` exactly like the other query handlers, all
sharing the one `PostRepository` binding — currently
`new FirebasePostRepository()`. `FakePostRepository` exists as a
fully-built in-memory alternative (see [Infrastructure](#infrastructure)
above); switching back is a one-line change to that single binding,
nothing else in this section moves. `PostImageUploader`'s own binding
now lives in `dashboard`'s section of `composition-root.ts` — see
[dashboard.md](dashboard.md#di-wiring).

## Tests

```
domain/
  entities/__tests__/        Post.entity.test.ts, Post.mother.ts
  collections/__tests__/     Post.collection.test.ts, Category.collection.test.ts
application/
  query/__tests__/           ListPosts.queryHandler.test.ts (mocked repository)
                              ListPosts.queryHandler.integration.test.ts (real FakePostRepository)
                              ListCategories.queryHandler.test.ts (mocked repository)
  command/__tests__/         CreatePost.commandHandler.test.ts (mocked repository)
infrastructure/
  __tests__/                 FakePost.repository.test.ts (includes save())
  acl/__tests__/              Post.mapper.test.ts, FirestorePost.mapper.test.ts (includes toPersistence())
```

`CreatePost.commandHandler.test.ts` mocks `PostRepository` and asserts
both that a valid command builds and saves the right `Post` (captured
via `ts-mockito`'s `capture()`) and that invalid fields still throw the
normal value-object error before `save()` is ever reached.

`Post.mapper.test.ts` and `FirestorePost.mapper.test.ts` are pure unit
tests — hand-built markdown/`DocumentData` fixtures (the latter with a
real `Timestamp.fromDate(...)`), no filesystem or Firestore connection
needed. Between them they cover both mappers' `Timestamp`→`Date`
conversion, that invalid data still throws through the normal
value-object validation (`InvalidCategoryError`, etc.), and — for
`image` — both the "explicit value wins" and "falls back to
`postImagePlaceholderUrl` when absent" paths, on both mappers.
`FirebasePostRepository` itself has no test: it's a thin sequence of
Firestore SDK calls with no branching logic of its own beyond the
`findBySlug()` query, and testing it for real would need the Firebase
Local Emulator Suite, which isn't wired into this repo — add that if the
SDK-call sequencing itself ever needs coverage beyond what the ACL test
and manual verification against the real project already give it.

The integration test is the one place production-looking code
intentionally imports an infrastructure class from an application-layer
test — see
[07-testing-strategy.md](../07-testing-strategy.md#arch-tests--enforce-the-dependency-rule-in-ci)
on why `__tests__/` is excluded from the arch-test boundary check. It
also asserts against the real seeded categories (e.g. exactly 5 posts
tagged `Architecture`), so a future edit to `src/data/posts/` frontmatter
that breaks the category counts fails a test instead of silently
drifting. `PostReadService`/`PostStateService` (thin composition over
already-tested handlers) and all of presentation — containers,
components, skeletons — have no dedicated tests; presentation isn't
unit-tested in this app at all, see
[07-testing-strategy.md](../07-testing-strategy.md#presentation-is-not-unit-tested).
Covered end-to-end instead, by
[`e2e/features/home.feature`](../../e2e/features/home.feature),
[`category.feature`](../../e2e/features/category.feature), and
[`post.feature`](../../e2e/features/post.feature).
