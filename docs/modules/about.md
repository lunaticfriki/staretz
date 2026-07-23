# Module: About

The `/about` page — static content describing the site.

## Routes

| Path | Component |
|---|---|
| `/about` | `AboutPage` |

Registered in [`app.tsx`](../../src/app.tsx) as
`<AboutPage path="/about" />` inside the `preact-router` `<Router>`.

## Why this module has no domain/application/infrastructure

`about` is the minimal case of the four-layer shape: it has exactly one
file.

```
src/modules/about/
  presentation/
    AboutPage.component.tsx
```

There's no data to model (no entities, no value objects — the copy is a
hardcoded string), nothing to query or command (no application layer),
and nothing external to adapt (no infrastructure). Forcing empty
`domain/`/`application/`/`infrastructure/` folders onto a module with no
content for them would be ceremony, not architecture — see
[06-vertical-slicing.md](../06-vertical-slicing.md). The moment this page
needs real data (e.g. team bios pulled from somewhere), it grows the
layers it needs at that point, the same way `blog` did.

## Presentation

`AboutPage.component.tsx` takes `RouteProps` (the `path`
`preact-router` needs) and renders directly — no container, no state
service, no skeleton, because there's no loading state to show. It's
centered to a readable width (`mx-auto max-w-3xl`) inside the
full-width [`Layout`](shared-theme.md), the same treatment as the blog
post reading view — see
[blog.md](blog.md#presentation) and
[shared-theme.md](shared-theme.md).

## Tests

None — presentation isn't unit-tested in this app (see
[07-testing-strategy.md](../07-testing-strategy.md#presentation-is-not-unit-tested)).
Covered by
[`e2e/features/navigation.feature`](../../e2e/features/navigation.feature)
(navigating to `/about` and asserting the heading renders in a real
browser).
