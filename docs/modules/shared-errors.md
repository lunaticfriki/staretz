# Shared: Errors

The two base exception types every domain error/warning in the app
extends, plus the one service that turns a caught one into something the
user sees. See
[01-domain-layer.md](../01-domain-layer.md#domain-errors-and-warnings-live-in-the-domain-not-the-application-layer)
for the domain-vs-application placement rule this exists to support.

## Domain

```
src/shared/errors/domain/
  Domain.error.ts       — export abstract class DomainError extends Error {}
  Domain.warning.ts     — export abstract class DomainWarning extends Error {}
```

Every value object's own validation error in this app extends
`DomainError` directly (`InvalidSlugError`, `InvalidThemeModeError`,
`InvalidNotificationIdError`, ...) and stays co-located in that value
object's own file — none of them live here. `PostNotFoundError`
(`modules/blog/domain/errors/`) is the one condition/outcome error in the
app that gets its own `domain/errors/` folder, because it isn't tied to a
single value object. No production code extends `DomainWarning` yet (only
a test double, `SampleWarning` in `ErrorManager.service.test.ts`) — it
exists for the first genuinely non-fatal, "degraded but working"
condition that comes along (a fallback to cached data, for example), so
the type is ready without a real usage forcing an artificial one today.

## Application

`src/shared/errors/application/ErrorManager.service.ts` — `ErrorManager`,
one method: `handle(error: Error): void`. Checks
`error instanceof DomainWarning` to decide `'warning'` vs `'error'`, then
calls `notificationStateService.notify(kind, error.message)` — see
[shared-notifications.md](shared-notifications.md). No state of its own,
so no `.stateService.ts` — it's a pure orchestrator delegating to
`NotificationStateService` for the reactive part.

The one real caller today is
`PostStateServiceImpl.loadPosts()`
([blog.md](blog.md#application)) — a genuine failure loading the post
list reports through here in addition to setting local `error` state.
`loadBySlug`'s "not found" outcome deliberately does *not* call this — see
the note in [blog.md](blog.md#domain) on why that's local state instead.

## DI wiring

`ErrorManager` needs `NotificationStateService`, so it's bound after it
in `composition-root.ts`. Symbol: `ErrorManager`.

## Tests

`application/__tests__/ErrorManager.service.test.ts` — mocks
`NotificationStateService`, asserts a `DomainWarning` subclass maps to
`'warning'` and a plain `Error` maps to `'error'`, via `verify(...)` on
the mocked `notify` call.
