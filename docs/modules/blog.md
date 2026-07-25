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
  repositories/
    Post.repository.ts
  errors/
    PostNotFound.error.ts
```

**`Post`** is a read-only entity — every field `public readonly`, no
behavior methods — built through `Post.create(...)`/`Post.empty()`. Its
seven fields are all value objects, never primitives: `slug` (`Slug`,
lowercase-kebab-case, validated by regex), `title`/`excerpt`/`content`/
`author`/`category` (each a non-empty-string wrapper with its own
`InvalidXxxError`), `publishedAt` (`PublishedAt`, wraps a `Date`, exposes
`isAfter()` for ordering and `toDate()`/`toISOString()` — never a bare
`Date` escapes the value object).

**`Category`** is a plain non-empty-string wrapper (same shape as
`PostAuthor`) — `create(value)` trims and rejects empty,
`equals()` compares case-insensitively. It does not know about slugs or
URLs; the category-page route encodes the display value directly (see
[Presentation](#presentation) below) rather than introducing a second
"slug" concept for what's already a short, human-readable string.

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
`findAll(): Promise<PostCollection>` and
`findBySlug(slug: Slug): Promise<Post | null>` — domain knows nothing
about markdown files or `import.meta.glob`. Filtering and category
listing are both derived from `findAll()` in the application layer
(see below), not separate repository methods — there's no persistence
concern that would justify pushing them down into the port.

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
  Post.readService.ts
  Post.stateService.ts
```

Three query handlers, no commands — the blog is read-only from the app's
perspective (posts come from markdown files checked into the repo, not
authored through the UI).

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
- **`PostReadService`**: zero library dependencies, wraps all three
  handlers behind `listPosts()`/`getBySlug()`/`listCategories()`.
  Because `Post`/`CategoryCollection` are read-only, every method
  returns the domain type directly (`Page<Post>`/`Post`/
  `CategoryCollection`) — no `Post.readModel.ts` DTO — see
  [05-presentation-layer.md](../05-presentation-layer.md#read-models-are-optional--presentation-may-render-a-domain-entity-directly).
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
  acl/
    Post.mapper.ts
    markdownFrontmatter.util.ts
```

**`FakePostRepository`** is the only `PostRepository` adapter — despite
the "Fake" name (a holdover from when it was test-only), it's what
production actually binds: `import.meta.glob('/src/data/posts/*.md', ...)`
eagerly loads every file under
[`src/data/posts/`](../../src/data/posts/) at build time, mapped through
the ACL into `Post` entities held in memory. There's no HTTP/DB backend
for posts in this app — swapping to one later means writing a new
`PostRepository` implementation and changing one binding in
`composition-root.ts`, nothing else.

**`markdownFrontmatter.util.ts`** splits a raw `.md` file into
`{ frontmatter, body }` by regex-matching the leading `---`-delimited
block. **`PostMapper.toDomain(raw)`** takes that output and constructs a
`Post` through its factories (`Slug.create(frontmatter.slug)`,
`Category.create(frontmatter.category)`, etc.) — this is the
Anti-Corruption Layer: markdown/frontmatter vocabulary never leaks past
this file. See
[04-infrastructure-layer.md](../04-infrastructure-layer.md#the-anti-corruption-layer-acl).

Post frontmatter shape (see any file in `src/data/posts/`):

```markdown
---
slug: hexagonal-architecture-explained
title: Hexagonal Architecture Explained
excerpt: A short summary shown in the preview card.
author: Marco Reyes
publishedAt: 2026-01-01
category: Architecture
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
  postImageUrl.util.ts
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
`PostView` respectively. `PostView` itself owns a full-bleed hero image
(see [`postImageUrl.util.ts`](#postimageurlutilts) below) with the
reading column (`mx-auto max-w-3xl`) only wrapping the body content
underneath it, not the hero — see
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

**`postImageUrl.util.ts`** derives a deterministic
`https://picsum.photos/seed/<slug>/<w>/<h>` URL from a post's `Slug` —
the same post always gets the same placeholder photo, without storing an
image URL anywhere. `PostPreview` uses it for the card thumbnail;
`PostView` uses it (at a larger size) for the hero. Purely a rendering
concern — no domain field, no frontmatter entry.

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
three query handlers) → `PostStateService` (needs `PostReadService` +
`ErrorManager`). Symbols in
[`shared/di/types.ts`](../../src/shared/di/types.ts):
`PostRepository`, `PostReadService`, `PostStateService`. No new symbols
were needed for categories/search — `ListCategoriesQueryHandler` is
constructed inline in `composition-root.ts` exactly like the other two
handlers, all sharing the one `PostRepository` binding.

## Tests

```
domain/
  entities/__tests__/        Post.entity.test.ts, Post.mother.ts
  collections/__tests__/     Post.collection.test.ts, Category.collection.test.ts
application/
  query/__tests__/           ListPosts.queryHandler.test.ts (mocked repository)
                              ListPosts.queryHandler.integration.test.ts (real FakePostRepository)
                              ListCategories.queryHandler.test.ts (mocked repository)
infrastructure/
  __tests__/                 FakePost.repository.test.ts
```

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
