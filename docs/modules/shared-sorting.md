# Shared: Sorting

A generic criteria value object for ordering any collection by one of
several fields, in either direction — `SortCriteria<Field>`. Same shape
as [shared-pagination.md](shared-pagination.md)/
[shared-search.md](shared-search.md): a plain, stateless, zero-dependency
value object, domain-only (no application/infrastructure/presentation
layers of its own), because the concern is a reusable primitive rather
than a feature with its own data or state.

## Domain

```
src/shared/sorting/domain/
  value-objects/
    SortCriteria.valueObject.ts
    __tests__/
      SortCriteria.valueObject.test.ts
```

**`SortCriteria<Field extends string>`** wraps `{ field: Field | null,
direction: 'asc' | 'desc' }`. Unlike `PaginationCriteria`/
`SearchCriteria`, it's generic — sortable *field names* are inherently
module-specific (a `Post` sorts by `title`/`category`/`publishedAt`; a
future sortable list would have its own field union), so the type
parameter is what keeps this a genuinely reusable, zero-knowledge
primitive rather than baking one module's vocabulary into `shared/`. This
is the same generic-over-`T` shape `Page<T>` already uses
([shared-pagination.md](shared-pagination.md#domain)), just parameterized
over a field-name union instead of an item type.

- `create(field, direction = 'asc')` — an explicit sort.
- `none()` — the neutral "no explicit sort" instance (`field: null`).
  `isEmpty` is true only for this instance.
- `toggled(field)` — the one piece of behavior beyond a plain data
  holder: clicking a column header calls this and gets back the next
  criteria to use. Same field as the current criteria → direction
  flips (`asc` ⇄ `desc`). Different field (or currently empty) → resets
  to that field, ascending. This is what lets a header button's
  `onClick` be a one-liner (`onSortChange(sort.toggled(field))`) instead
  of the container working out ascending-vs-descending itself — see
  [dashboard.md](dashboard.md#presentation).
- `equals()` rounds it out like any value object.

## How a module uses it

A domain collection gains a `sortBy(criteria: SortCriteria<Field>):
Self`-shaped method — see `PostCollection.sortBy()` in
[blog.md](blog.md#domain): a module-local
`Record<PostSortField, (a: Post, b: Post) => number>` maps each
sortable field to its comparator (string fields via `localeCompare`,
dates via `getTime()` subtraction), `sortBy()` looks up the comparator
for `criteria.field`, and negates it for `'desc'`. `sortBy()` on an
empty criteria (`criteria.field === null`) returns the collection
unchanged — callers that don't care about explicit sorting (see below)
never need to special-case that themselves.

`ListPostsQuery` carries a `sort: SortCriteria<PostSortField>` field,
defaulting to `SortCriteria.none()` so every existing call site (the
public blog's `HomeContainer`/`CategoryPageContainer`, which have no
sorting UI) keeps working unchanged. `ListPostsQueryHandler` branches
on `query.sort.isEmpty`: empty falls back to the pre-existing
`sortedByMostRecent()` default (unchanged public-blog behavior); a real
criteria goes through `sortBy()` instead — see
[blog.md](blog.md#application). Either way, sorting always happens
*before* `paginate()`, the same ordering `filterByCategory` already
required — see
[shared-pagination.md](shared-pagination.md#how-a-module-uses-it).

## Why no application/infrastructure/presentation layers

Same reasoning as
[shared-pagination.md](shared-pagination.md#why-no-applicationinfrastructurepresentation-layers):
no state to hold reactively (the caller's own state service holds
whichever already-sorted `Page<T>` it loaded), nothing external to
adapt, and the one UI piece that lets a user change the sort — the
arrow buttons in dashboard's `PostsTable.component.tsx` — is
dashboard-specific (it renders `Post`-shaped rows and knows about
`PostSortField`), so it lives in
`modules/dashboard/presentation/components/`, not here. `shared/sorting/`
stays a pure, reusable ordering primitive any future module can sort
with, the same way `shared/pagination/`/`shared/search/` stay reusable.

## Tests

```
domain/value-objects/__tests__/
  SortCriteria.valueObject.test.ts
```

Pure value object tests, no mocks needed — covers `create()`'s default
direction, `none()`'s emptiness, and every `toggled()` transition
(empty → field ascending, same field flips, different field resets to
ascending).
