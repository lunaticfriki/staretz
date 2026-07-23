# Shared: Notifications

Toast-style notifications, rendered app-wide. The canonical worked
example in [11-shared-services.md](../11-shared-services.md) — this doc
is the "as actually built" companion to that one.

## Domain

```
src/shared/notifications/domain/
  entities/
    Notification.entity.ts
  value-objects/
    NotificationId.valueObject.ts
    NotificationMessage.valueObject.ts
```

**`Notification`**: `id` (`NotificationId`, `crypto.randomUUID()`-backed),
`kind` (`NotificationKind = 'info' | 'success' | 'warning' | 'error'`,
deliberately a plain literal union, not a value object — a small, closed,
compiler-checked set with nothing to validate; see
[01-domain-layer.md](../01-domain-layer.md#no-primitives-in-the-domain)),
`message` (`NotificationMessage`, non-empty string wrapper). Built via
`Notification.create({ kind, message })`; `Notification.empty()` is the
neutral placeholder.

## Application

`src/shared/notifications/application/`:

- **`NotificationService`** (`NotificationService.service.ts`) — zero
  library dependencies, one method: `create(kind, message)` →
  `Notification`.
- **`NotificationStateService`** (`Notification.stateService.ts`) — the
  signals dependency. `notifications: Signal<Notification[]>`, `notify()`
  (constructs via `NotificationService` then appends),
  `dismiss(id)` (filters by `!id.equals(...)`).

## Presentation

`src/shared/presentation/`: **`NotificationCenter.component.tsx`** +
**`useNotificationsState.hook.ts`**, mounted once inside `Layout` so it's
present on every route. `useNotificationsState()` has no `useEffect` —
unlike `useThemeState`/`usePostBySlugState`, there's nothing to trigger on
mount, it's purely a reactive read of `notifications.value` plus a
`dismiss` callback. `NotificationCenter` renders nothing
(`notifications.length === 0` → `null`) until something calls `notify()`;
each toast is color-coded by `kind` and fixed to the bottom of the
viewport, dismissible via an `aria-label="Dismiss"` button. Lives flat in
`shared/presentation/` alongside `Header`/`Footer`/`Layout` rather than
under a nested `presentation/` of its own, for the same reason described
in [shared-theme.md](shared-theme.md#presentation) — this renders on
every page, not one feature's route.

Nothing in this app currently calls `notify()` directly from a route —
the only caller today is [`ErrorManager`](shared-errors.md), for genuine
failures. The service is still independently usable (and tested) for any
future direct use — e.g. "saved successfully" after a future write
operation.

## DI wiring

`NotificationService` (no deps) → `NotificationStateService` (needs
`NotificationService`), both `.inSingletonScope()`. Symbols:
`NotificationService`, `NotificationStateService`.

## Tests

```
domain/entities/__tests__/     Notification.entity.test.ts, Notification.mother.ts
application/__tests__/         Notification.stateService.test.ts (mocked NotificationService)
```

`NotificationCenter`/`useNotificationsState` have no dedicated test —
presentation isn't unit-tested in this app, see
[07-testing-strategy.md](../07-testing-strategy.md#presentation-is-not-unit-tested).
There isn't currently an E2E scenario driving a real notification either
(nothing in the app triggers one from a reachable user flow today — see
the `ErrorManager`-is-the-only-caller note above); add one under
[`e2e/features/`](../../e2e/features/) if/when a real flow starts
surfacing notifications.
