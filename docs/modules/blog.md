# Module: Blog

The blog itself — the home page's list of recent posts and the
individual post reading view. The reference implementation of the full
domain → application → infrastructure → presentation shape in this
codebase; read this alongside [01](../01-domain-layer.md)–[05](../05-presentation-layer.md)
to see the general rules made concrete.

## Routes

| Path | Container |
|---|---|
| `/` | `HomeContainer` |
| `/blog/:slug` | `PostPageContainer` |

Registered in [`app.tsx`](../../src/app.tsx).

## Domain

```
src/modules/blog/domain/
  entities/
    Post.entity.ts
  collections/
    Post.collection.ts
  value-objects/
    Slug.valueObject.ts
    PostTitle.valueObject.ts
    PostExcerpt.valueObject.ts
    PostContent.valueObject.ts
    PostAuthor.valueObject.ts
    PublishedAt.valueObject.ts
  repositories/
    Post.repository.ts
  errors/
    PostNotFound.error.ts
```

**`Post`** is a read-only entity — every field `public readonly`, no
behavior methods — built through `Post.create(...)`/`Post.empty()`. Its
six fields are all value objects, never primitives: `slug` (`Slug`,
lowercase-kebab-case, validated by regex), `title`/`excerpt`/`content`/
`author` (each a non-empty-string wrapper with its own
`InvalidXxxError`), `publishedAt` (`PublishedAt`, wraps a `Date`, exposes
`isAfter()` for ordering and `toDate()`/`toISOString()` — never a bare
`Date` escapes the value object).

**`PostCollection`** (`domain/collections/`) wraps `Post[]` and owns the
one piece of collection-level domain behavior this module has:
`sortedByMostRecent()` (uses `PublishedAt.isAfter()`) and `take(limit)`.
Both return a new `PostCollection` (immutable, like a value object).
`toArray()` is the one sanctioned exit to a plain array, called exactly
once, at the presentation boundary (see below) — domain and application
code never touch `Post[]` directly. See
[01-domain-layer.md](../01-domain-layer.md#folder-structure-within-the-domain-layer)
for when a collection is worth introducing over a plain array.

**`PostRepository`** (port, `abstract class`) declares
`findAll(): Promise<PostCollection>` and
`findBySlug(slug: Slug): Promise<Post | null>` — domain knows nothing
about markdown files or `import.meta.glob`.

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
    ListLatestPosts.query.ts
    ListLatestPosts.queryHandler.ts
    GetPostBySlug.query.ts
    GetPostBySlug.queryHandler.ts
  Post.readService.ts
  Post.stateService.ts
```

Two query handlers, no commands — the blog is read-only from the app's
perspective (posts come from markdown files checked into the repo, not
authored through the UI).

- **`ListLatestPostsQueryHandler`**: `findAll()` then
  `.sortedByMostRecent().take(query.limit)` — the sort/limit logic lives
  on `PostCollection`, the handler just sequences the call.
- **`GetPostBySlugQueryHandler`**: `Slug.create(query.slug)` then
  `findBySlug`; throws `PostNotFoundError` if `null`.
- **`PostReadService`**: zero library dependencies, wraps both handlers
  behind `listLatest()`/`getBySlug()`. Because `Post` is read-only, both
  methods return the domain type directly — no `Post.readModel.ts` DTO —
  see
  [05-presentation-layer.md](../05-presentation-layer.md#read-models-are-optional--presentation-may-render-a-domain-entity-directly).
- **`PostStateService`**: the only file here depending on
  `@preact/signals-core`. Two signals: `latestPosts` (`LatestPostsState` —
  `loading | loaded (PostCollection) | error`) and `postBySlug`
  (`PostBySlugState` — `loading | loaded (Post) | not-found`). `loadLatest`
  reports genuine failures to `ErrorManager`
  ([shared-errors.md](shared-errors.md)); `loadBySlug` deliberately does
  not — see the `PostNotFoundError` note above.

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
`Post` through its factories (`Slug.create(frontmatter.slug)`, etc.) —
this is the Anti-Corruption Layer: markdown/frontmatter vocabulary never
leaks past this file. See
[04-infrastructure-layer.md](../04-infrastructure-layer.md#the-anti-corruption-layer-acl).

Post frontmatter shape (see any file in `src/data/posts/`):

```markdown
---
slug: hexagonal-architecture-explained
title: Hexagonal Architecture Explained
excerpt: A short summary shown in the preview card.
author: Marco Reyes
publishedAt: 2026-01-01
---

Markdown body, rendered through `marked` in `PostView`.
```

## Presentation

```
src/modules/blog/presentation/
  containers/
    Home.container.tsx
    PostPage.container.tsx
  components/
    PostPreview.component.tsx
    PostPreview.skeleton.tsx
    PostView.component.tsx
    PostView.skeleton.tsx
    PostNotFound.component.tsx
  useRecentPostsState.hook.ts
  usePostBySlugState.hook.ts
  formatPublishedAt.util.ts
```

**`HomeContainer`**: `useRecentPostsState(5)` → branches on
`status`. `loading` renders 5 `PostPreviewSkeleton`s in the same
`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` the loaded state uses
(so nothing jumps), `error` renders the message, `loaded` calls
`state.posts.toArray().map(...)` — the one place `PostCollection`
becomes a plain array, right before it turns into JSX. Cards are
`PostPreview`, each linking to `/blog/:slug`; height is driven by content
(`line-clamp-2`/`line-clamp-3` on title/excerpt) rather than a forced
aspect ratio, so five posts of varying excerpt length don't produce
ragged empty space.

**`PostPageContainer`**: `usePostBySlugState(slug)` → `loading` /
`not-found` / `loaded` renders `PostViewSkeleton` / `PostNotFound` /
`PostView` respectively, all three wrapped in one shared
`mx-auto max-w-3xl` div so the reading column stays centered and
consistent across all three states even though the outer `Layout` is
full-width — see [shared-theme.md](shared-theme.md#layout-is-full-width-reading-pages-recenter-themselves).

**`PostView`** renders the post body by piping `post.content.toString()`
through `marked.parse()` into `dangerouslySetInnerHTML` on a
`prose prose-gray ... dark:prose-invert` container (Tailwind Typography),
with `prose-headings:`/`prose-a:` overrides so markdown headings/links
pick up the site's purple accent instead of the plugin's default gray.

Both hooks (`useRecentPostsState`, `usePostBySlugState`) follow the exact
shape from
[08-tech-preact-typescript.md](../08-tech-preact-typescript.md#presentation-a-thin-adapter-over-the-state-services-signal):
pull the state service from `container`, `useEffect` to trigger the
load on mount/param-change, return `.value`. Neither holds its own
`useState`.

## DI wiring

Bound in [`composition-root.ts`](../../src/composition-root.ts), in
dependency order: `PostRepository` → `PostReadService` (composes both
query handlers) → `PostStateService` (needs `PostReadService` +
`ErrorManager`). Symbols in
[`shared/di/types.ts`](../../src/shared/di/types.ts):
`PostRepository`, `PostReadService`, `PostStateService`.

## Tests

```
domain/
  entities/__tests__/        Post.entity.test.ts, Post.mother.ts
  collections/__tests__/     Post.collection.test.ts
application/
  query/__tests__/           ListLatestPosts.queryHandler.test.ts (mocked repository)
                              ListLatestPosts.queryHandler.integration.test.ts (real FakePostRepository)
infrastructure/
  __tests__/                 FakePost.repository.test.ts
```

The integration test is the one place production-looking code
intentionally imports an infrastructure class from an application-layer
test — see
[07-testing-strategy.md](../07-testing-strategy.md#arch-tests--enforce-the-dependency-rule-in-ci)
on why `__tests__/` is excluded from the arch-test boundary check.
`PostReadService`/`PostStateService` (thin composition over already-tested
handlers) and all of presentation — containers, components, skeletons —
have no dedicated tests; presentation isn't unit-tested in this app at
all, see
[07-testing-strategy.md](../07-testing-strategy.md#presentation-is-not-unit-tested).
Covered end-to-end instead, by
[`e2e/features/home.feature`](../../e2e/features/home.feature) and
[`post.feature`](../../e2e/features/post.feature).
