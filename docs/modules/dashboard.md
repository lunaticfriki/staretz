# Module: Dashboard

The private admin screen for writing and publishing new blog posts.
Presentation-only — no domain/application/infrastructure of its own,
the same minimal shape as [about.md](about.md): it has no data concept
that doesn't already belong to `blog` (the post being written) or
`shared/auth`/`shared/policies` (who's allowed to see it).

## Routes

| Path | Container | Guarded by |
|---|---|---|
| `/dashboard` | `DashboardContainer` | `DASHBOARD_ACCESS_POLICY` (see below) |

Registered in [`app.tsx`](../../src/app.tsx), wrapped in
`RequirePolicy` rather than mounted directly — see
[shared-policies.md](shared-policies.md#presentation) for how the guard
works. `/login` (`LoginPage`, unguarded) is the redirect target when the
policy fails.

## Why this module has no domain/application/infrastructure

```
src/modules/dashboard/
  dashboardPolicy.ts
  presentation/
    containers/
      Dashboard.container.tsx
    components/
      PostForm.component.tsx
```

Writing a post is `blog`'s concern (`CreatePostCommand`/
`PostWriteService`, see [blog.md](blog.md#application)); who's allowed
to write one is `shared/auth`/`shared/policies`'s concern. Dashboard is
the screen that composes those three existing capabilities — it
doesn't introduce a new entity, a new port, or a new piece of reactive
state, so it doesn't earn the other three layers, the same reasoning
[about.md](about.md#why-this-module-has-no-domainapplicationinfrastructure)
gives for the About page.

**`dashboardPolicy.ts`** is the one non-presentation file: it exports
`DASHBOARD_ACCESS_POLICY = PolicyName.create('dashboard:access')`, the
single source of truth for that string, imported by both `app.tsx`
(to guard the route) and `composition-root.ts` (to register which
`Policy` answers for it). It's a plain, kind-suffix-less file — the
same exemption `RouteProps.ts`/`composition-root.ts` get in
[06-vertical-slicing.md](../06-vertical-slicing.md#file-naming-convention),
for a constant rather than a class hierarchy.

## Presentation

**`PostForm`** is a self-contained, pure-ish component in the same
mold as `CategorySearch`/`CategoryMenu` (see
[blog.md](blog.md#presentation)): it owns its own field state via
`useState` and emits a plain `PostFormValues` object through `onSubmit`
— slug auto-derives from the title (kebab-cased) until the slug field
itself is edited directly, `publishedAt` defaults to today, and the
category input reads existing categories from `useCategoriesState()`
(reused from `blog`) as a `<datalist>` for convenience, not enforcement
— any category string is still valid, matching `Category`'s own lack of
a fixed enum.

**`DashboardContainer`** sequences the two-step publish flow
explicitly rather than folding it into `PostWriteService`: `1)` if an
image file was selected, `PostImageUploader.upload(file)` resolves it
to a real `PostImage` URL; `2)` `CreatePostCommand` (with that URL) goes
to `PostWriteService.createPost()`. Keeping upload and create as two
calls here — rather than teaching `PostWriteService` about `File`/
browser APIs — keeps the write service pure and portable, consistent
with [03-application-layer-cqrs.md](../03-application-layer-cqrs.md)'s
"application services MUST NOT import a component, a hook, or anything
that renders" (a `File` upload is a presentation/browser concern, not
a domain one). Success/failure surfaces through the existing
`NotificationStateService` ([shared-notifications.md](shared-notifications.md))
as a toast — no dashboard-specific notification mechanism.

## DI wiring

No new symbols — `DashboardContainer` pulls `PostImageUploader`,
`PostWriteService`, and `NotificationStateService` from `container`
directly (all three already bound for other consumers; see
[blog.md](blog.md#di-wiring) and
[shared-notifications.md](shared-notifications.md#wiring-into-the-composition-root)).

## Tests

None — presentation isn't unit-tested in this app, see
[07-testing-strategy.md](../07-testing-strategy.md#presentation-is-not-unit-tested).
The write-side logic it drives (`CreatePostCommandHandler`,
`PolicyService`, `AuthStateService`) is tested where it's actually
defined — see [blog.md](blog.md#tests),
[shared-policies.md](shared-policies.md#tests),
[shared-auth.md](shared-auth.md#tests).
