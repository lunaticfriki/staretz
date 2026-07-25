# Shared: Pagination

A generic criteria/result pair for paginating any domain collection —
`PaginationCriteria` (the request: which page, how many per page) and
`Page<T>` (the result: the items for that page plus enough metadata to
render page controls). Both are plain, stateless value objects with zero
library dependencies — this is the "generic value object like `Money`"
case called out in
[06-vertical-slicing.md](../06-vertical-slicing.md#rules): a cross-cutting
primitive, not a feature module, so it's domain-only — no
application/infrastructure/presentation layers of its own.

## Domain

```
src/shared/pagination/domain/
  value-objects/
    PaginationCriteria.valueObject.ts
    Page.valueObject.ts
    __tests__/
      PaginationCriteria.valueObject.test.ts
      Page.valueObject.test.ts
```

**`PaginationCriteria`** wraps `{ page, perPage }` — `create(page, perPage)`
validates both are positive integers (`InvalidPaginationCriteriaError`
otherwise), `offset` derives the zero-based slice start
(`(page - 1) * perPage`), `withPage(page)` returns a new criteria for
navigating to a different page without touching `perPage`, `equals()`
rounds it out like any value object.

**`Page<T>`** is the generic result envelope: `create({ items, criteria,
totalItems })` builds one from whatever slice a repository/collection
produced plus the total count across all pages. `totalPages` derives from
`totalItems`/`perPage` (`Math.ceil`, floored at 1), `hasNextPage`/
`hasPreviousPage` derive from `page` vs `totalPages`/`1`. Being generic
over `T`, it has no opinion on what's being paginated — any module can
import it without `shared/pagination` knowing that module exists.

## How a module uses it

A domain collection gains a `paginate(criteria: PaginationCriteria):
Page<T>` method that slices itself and reports the total — see
`PostCollection.paginate()` in [blog.md](blog.md#domain) for the concrete
example: sort first, then paginate, so criteria always applies to an
already-ordered collection. A query handler passes the criteria through
unchanged; the collection is the one place that knows how to turn "give me
page 2 of 5" into an actual slice, keeping that logic on the domain object
rather than duplicated in every handler that needs pagination.

## Why no application/infrastructure/presentation layers

There's no state to hold reactively (the caller's own state service holds
whichever `Page<T>` it loaded), nothing external to adapt (it's pure
in-memory computation), and no UI of its own baked in — only a generic,
reusable `Pagination.component.tsx` in the app-wide
`shared/presentation/` folder (next to `Header`/`Footer`/
`NotificationCenter`, same rationale as
[shared-notifications.md](shared-notifications.md#presentation)): a pure
component taking `{ page, totalPages, onPageChange }` and rendering
Prev/current-page-highlighted/Next controls, centered via `flex
justify-center`. It renders `null` when `totalPages <= 1` so a short list
doesn't grow empty page controls. It has no knowledge of `Post` or any
other domain type — any paginated list in the app can reuse it by wiring
its own `Page<T>.page`/`.totalPages` and a page-change callback.

## Tests

```
domain/value-objects/__tests__/
  PaginationCriteria.valueObject.test.ts
  Page.valueObject.test.ts
```

Pure value object tests, no mocks needed. `Pagination.component.tsx` has
no dedicated test — presentation isn't unit-tested in this app, see
[07-testing-strategy.md](../07-testing-strategy.md#presentation-is-not-unit-tested);
covered end-to-end via
[`e2e/features/home.feature`](../../e2e/features/home.feature).
