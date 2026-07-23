# Shared Cross-Cutting Services

Some concerns aren't owned by any one feature module — error reporting,
notifications, auth session, feature flags. They live in `shared/`, but
they follow the exact same architectural patterns a feature module does:
real domain modeling when the concern has actual data shape, a pure
application service, and — if the concern needs reactive state — a
dedicated state service isolating that dependency, exactly as described in
[03-application-layer-cqrs.md](03-application-layer-cqrs.md#readwrite-services-stay-pure-a-state-service-holds-the-signal).
"Shared" describes *where* the code lives and *who* depends on it, not a
license to skip the rules.

This doc walks through the two shared services every project starts with —
`NotificationService`/`NotificationStateService` and `ErrorManager` — as the
canonical example to copy when building the next one.

## Folder structure

```
shared/
  errors/
    domain/
      Domain.error.ts
      Domain.warning.ts
    application/
      ErrorManager.service.ts
      __tests__/
        ErrorManager.service.test.ts
  notifications/
    domain/
      entities/
        Notification.entity.ts
        __tests__/
          Notification.entity.test.ts
          Notification.mother.ts
      value-objects/
        NotificationId.valueObject.ts
        NotificationMessage.valueObject.ts
    application/
      NotificationService.service.ts
      Notification.stateService.ts
      __tests__/
        Notification.stateService.test.ts
```

## Notification Service

A notification is a real domain concept with identity (each one can be
individually dismissed) — it gets a proper entity, not a loose object
literal.

```ts
// shared/notifications/domain/entities/Notification.entity.ts
export type NotificationKind = 'info' | 'success' | 'warning' | 'error'

interface CreateNotificationParams {
  kind: NotificationKind
  message: NotificationMessage
}

class Notification {
  private constructor(
    public readonly id: NotificationId,
    public readonly kind: NotificationKind,
    public readonly message: NotificationMessage,
  ) {}

  static create(params: CreateNotificationParams): Notification {
    return new Notification(NotificationId.generate(), params.kind, params.message)
  }

  static empty(): Notification {
    return new Notification(NotificationId.empty(), 'info', NotificationMessage.empty())
  }
}
```

`NotificationKind` stays a plain literal union, not a value object — it's a
small, closed, compiler-checked set with no validation logic to centralize,
which is what the no-primitives rule is actually protecting against (see
[01-domain-layer.md](01-domain-layer.md#no-primitives-in-the-domain)). The
`id` and `message` are real value objects (`NotificationId`,
`NotificationMessage`) because they carry actual validation and identity
semantics.

The application layer splits exactly like a feature module's read/write
services do — a pure service, and a state service holding the one signal:

```ts
// shared/notifications/application/NotificationService.service.ts — no library dependencies
abstract class NotificationService {
  abstract create(kind: NotificationKind, message: string): Notification
}

class NotificationServiceImpl extends NotificationService {
  create(kind: NotificationKind, message: string): Notification {
    return Notification.create({ kind, message: NotificationMessage.create(message) })
  }
}
```

```ts
// shared/notifications/application/Notification.stateService.ts — the signals dependency lives here only
import { signal, type Signal } from '@preact/signals-core'

abstract class NotificationStateService {
  abstract readonly notifications: Signal<Notification[]>
  abstract notify(kind: NotificationKind, message: string): void
  abstract dismiss(id: NotificationId): void
}

class NotificationStateServiceImpl extends NotificationStateService {
  readonly notifications = signal<Notification[]>([])

  constructor(private readonly notificationService: NotificationService) {
    super()
  }

  notify(kind: NotificationKind, message: string): void {
    const notification = this.notificationService.create(kind, message)
    this.notifications.value = [...this.notifications.value, notification]
  }

  dismiss(id: NotificationId): void {
    this.notifications.value = this.notifications.value.filter((n) => !n.id.equals(id))
  }
}
```

A presentation-layer `NotificationCenter` component subscribes to
`notifications.value` and renders a toast/banner per entry, calling
`dismiss(id)` on close — the same containers-read-a-signal pattern as any
feature module's state service. It lives in `shared/presentation/`
(`NotificationCenter.component.tsx`, plus a thin
`useNotificationsState.hook.ts`) alongside `Header`/`Footer`/`Layout` —
shared presentation is one flat, app-wide folder rather than one per
concern, since these pieces render on every route rather than belonging
to a single feature module. Mounted once in `Layout` so it's present on
every page.

## Error Manager

`ErrorManager` is the single place a thrown `DomainError`/`DomainWarning`
gets translated into something the user actually sees. It has no state of
its own — it's a pure orchestrator that delegates to
`NotificationStateService` for the reactive part, so it doesn't need its
own state service.

```ts
// shared/errors/application/ErrorManager.service.ts
abstract class ErrorManager {
  abstract handle(error: Error): void
}

class ErrorManagerImpl extends ErrorManager {
  constructor(private readonly notificationStateService: NotificationStateService) {
    super()
  }

  handle(error: Error): void {
    const kind = error instanceof DomainWarning ? 'warning' : 'error'
    this.notificationStateService.notify(kind, error.message)
  }
}
```

Any state service in the app that catches a genuine failure calls
`errorManager.handle(error)` in addition to setting its own local error
state — the local state drives that one screen's UI (an inline error
message, a retry button), while `ErrorManager` drives the app-wide
notification. Don't route *every* caught error through it — an expected,
navigable outcome (a "not found" from a bad URL param) is local state only;
see
[01-domain-layer.md](01-domain-layer.md#domain-errors-and-warnings-live-in-the-domain-not-the-application-layer)
for that distinction.

## Wiring into the composition root

Same `toDynamicValue` pattern as any other binding, wired in dependency
order — `NotificationService` has no deps, `NotificationStateService` needs
it, `ErrorManager` needs `NotificationStateService`, and any feature state
service that reports errors needs `ErrorManager`:

```ts
container.bind<NotificationService>(TYPES.NotificationService)
  .toDynamicValue(() => new NotificationServiceImpl())
  .inSingletonScope()

container.bind<NotificationStateService>(TYPES.NotificationStateService)
  .toDynamicValue((ctx) => new NotificationStateServiceImpl(ctx.get(TYPES.NotificationService)))
  .inSingletonScope()

container.bind<ErrorManager>(TYPES.ErrorManager)
  .toDynamicValue((ctx) => new ErrorManagerImpl(ctx.get(TYPES.NotificationStateService)))
  .inSingletonScope()

container.bind<PostStateService>(TYPES.PostStateService)
  .toDynamicValue((ctx) => new PostStateServiceImpl(
    ctx.get(TYPES.PostReadService),
    ctx.get(TYPES.ErrorManager),
  ))
  .inSingletonScope()
```

## When to build a new shared service this way

Build the full pattern (domain entities/VOs + pure service + state service)
when the concern has real data shape and/or needs reactive state — the next
candidates are typically auth session, feature flags, or a global
loading/offline indicator. If a cross-cutting concern is genuinely stateless
and trivial — a single pure formatting or validation function with no data
shape of its own — a plain `.util.ts` is enough. Don't force entities and a
state service onto something that's really just a function; don't skip
them onto something that's genuinely stateful and shared just because it's
a small amount of code today.
