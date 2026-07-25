# Shared: Search

A generic criteria value object for filtering any collection by a
free-text term — `SearchCriteria`. Same shape as
[shared-pagination.md](shared-pagination.md): a plain, stateless,
zero-dependency value object, domain-only (no application/infrastructure/
presentation layers of its own), because the concern is a reusable
primitive rather than a feature with its own data or state.

## Domain

```
src/shared/search/domain/
  value-objects/
    SearchCriteria.valueObject.ts
    __tests__/
      SearchCriteria.valueObject.test.ts
```

**`SearchCriteria`** wraps a single `term: string` — `create(term)` trims
it, `empty()` is the neutral "no filter" instance. `isEmpty` is true for
an empty or whitespace-only term. `matches(candidate)` does a
case-insensitive substring check against whatever string the caller is
filtering (an empty criteria matches everything, so callers don't need to
special-case "no search" separately from "search that matches all").
`equals()` rounds it out like any value object.

## How a module uses it

A domain collection gains a `filterByCategory(criteria: SearchCriteria):
PostCollection`-shaped method (the actual method name is
module-specific — `SearchCriteria` has no opinion on *what* is being
searched) that keeps items where `criteria.matches(field)` is true — see
`PostCollection.filterByCategory()` in
[blog.md](blog.md#domain), which filters posts by matching the criteria
against `post.category.toString()`. Because `matches()` on an empty
criteria always returns `true`, the "no filter, show everything" case
(the plain home page) and the "filtered by category" case (the category
page, whether from a dropdown click or a typed search) run through the
exact same code path — see
[blog.md](blog.md#presentation) for how `HomeContainer` and
`CategoryPageContainer` both call `usePostsPageState(page, perPage,
search)` with `search` defaulting to `''`.

## Why the click and the search box are the same mechanism

Clicking a category in the header dropdown links to
`/category/<exact category name>`; submitting the header search box
navigates to `/category/<whatever was typed>`. Both land on the same
`CategoryPageContainer`, which turns its `:term` route param into a
`SearchCriteria` and passes it straight through to `ListPostsQuery`. An
exact category name is just a term that happens to match precisely — no
separate "browse" vs. "search" code path to keep in sync.

## Why no application/infrastructure/presentation layers

Same reasoning as [shared-pagination.md](shared-pagination.md#why-no-applicationinfrastructurepresentation-layers):
no state to hold reactively, nothing external to adapt, and the two UI
pieces that use it (`CategoryMenu.component.tsx`,
`CategorySearch.component.tsx`) are blog-specific — they know about
`Category` and the blog read service — so they live in
`modules/blog/presentation/components/`, not here. `shared/search/`
stays a pure, reusable value object any future module can filter with,
the same way `shared/pagination/` stays reusable pagination math.

## Tests

```
domain/value-objects/__tests__/
  SearchCriteria.valueObject.test.ts
```

Pure value object tests, no mocks needed.
