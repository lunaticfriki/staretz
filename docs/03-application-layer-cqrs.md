# Application Layer & CQRS

The application layer orchestrates domain objects to satisfy a request. It
holds no business rules of its own — it fetches via a repository port, calls
domain methods, persists via a repository port. If a piece of logic in an
application service looks like a business decision (a conditional based on
business state, a calculation, a validation of a business invariant), it
belongs in the domain instead.

## Commands and queries, not use cases

We do not have a generic "use case" class per action. Instead, application
services are split by CQRS:

- **Write services** (commands): change state. One command, one handler.
  Returns nothing meaningful beyond success/failure (and maybe the new
  identity) — never a read model.
- **Read services** (queries): read state, return a DTO/read model shaped for
  the caller. Never mutate anything.

This split is enforced at the class level: a given application service is
either a command handler or a query handler, never both.

```ts
// application/order/command/ConfirmOrder.command.ts
class ConfirmOrderCommand {
  constructor(readonly orderId: string) {}
}

// application/order/command/ConfirmOrder.commandHandler.ts
class ConfirmOrderCommandHandler {
  constructor(private readonly orders: OrderRepository) {}

  async handle(command: ConfirmOrderCommand): Promise<void> {
    const id = OrderId.create(command.orderId)
    const order = await this.orders.findById(id)
    if (!order) {
      throw new OrderNotFoundError(id)
    }
    order.confirm()
    await this.orders.save(order)
  }
}
```

```ts
// application/order/query/GetOrder.query.ts
class GetOrderQuery {
  constructor(readonly orderId: string) {}
}

// application/order/query/GetOrder.queryHandler.ts
class GetOrderQueryHandler {
  constructor(private readonly orders: OrderRepository) {}

  async handle(query: GetOrderQuery): Promise<OrderReadModel> {
    const id = OrderId.create(query.orderId)
    const order = await this.orders.findById(id)
    if (!order) {
      throw new OrderNotFoundError(id)
    }
    return OrderReadModel.fromDomain(order)
  }
}
```

`order.confirm()` — the invariant check (can this order be confirmed given
its current status?) — lives on `Order`, not in the handler. The handler's
job is purely: load, delegate, persist.

## Why no use cases, and no data sources

**No use cases.** "Use case" as a generic pattern tends to become a bag where
business logic quietly accumulates because there's no CQRS discipline forcing
read/write separation, and no clear signal about whether a given class
mutates state. Naming things `XCommandHandler` / `XQueryHandler` makes the
read/write split explicit in the type itself, and keeps each handler doing
exactly one thing.

**No data sources.** Some layered-architecture templates insert a "data
source" abstraction between the repository interface and the actual
API/DB/cache call (`Repository → DataSource → API client`). We intentionally
flatten this: the repository implementation in infrastructure talks to the
API/DB/cache directly. The extra indirection rarely earns its keep — it
tends to exist only to satisfy a template, not because two different data
sources are genuinely swapped at runtime. If a repository truly needs to
combine multiple sources (cache + network), that composition lives inside
the repository implementation itself, still behind the one port the domain
declared.

## Read and write services are separated

Beyond command/query handlers per operation, group them so read access and
write access are two distinct dependency surfaces:

```ts
abstract class OrderWriteService {
  abstract confirm(command: ConfirmOrderCommand): Promise<void>
  abstract cancel(command: CancelOrderCommand): Promise<void>
}

abstract class OrderReadService {
  abstract getById(query: GetOrderQuery): Promise<OrderReadModel>
  abstract list(query: ListOrdersQuery): Promise<OrderReadModel[]>
}
```

(TypeScript: `abstract class`, not `interface` — see
[01-domain-layer.md](01-domain-layer.md#typescript-abstract-classes-not-interfaces-for-contracts).)

A container that only ever reads an order's status should only depend on
`OrderReadService`. This makes the blast radius of a component obvious from
its constructor/props, and makes mocking in tests trivial (see
[07-testing-strategy.md](07-testing-strategy.md)).

## Read/write services stay pure; a state service holds the signal

`OrderReadService`/`OrderWriteService` MUST have **zero library
dependencies** — not `@preact/signals-core`, not anything else. They are
plain classes wrapping query/command handlers, returning `Promise`s, fully
portable to any consumer (a script, a test, a different UI framework
entirely).

Reactive state lives in a third, dedicated file: `<Concept>.stateService.ts`.
It depends on the read (and/or write) service, holds the current state as a
`Signal`, and exposes a `load*`/action method that updates it. This is the
**only** file in a feature's application layer allowed to import
`@preact/signals-core` — every module gets this same three-way split going
forward: a pure read service, a pure write service (when the module has
commands), and one state service composing them.

```ts
// application/Order.readService.ts — no library dependencies
abstract class OrderReadService {
  abstract getById(query: GetOrderQuery): Promise<OrderReadModel>
}

class OrderReadServiceImpl extends OrderReadService {
  constructor(private readonly handler: GetOrderQueryHandler) {
    super()
  }

  getById(query: GetOrderQuery): Promise<OrderReadModel> {
    return this.handler.handle(query)
  }
}
```

```ts
// application/Order.stateService.ts — the only file with a signals dependency
import { signal, type Signal } from '@preact/signals-core'

type OrderState =
  | { status: 'loading' }
  | { status: 'loaded'; order: OrderReadModel }
  | { status: 'error'; message: string }

abstract class OrderStateService {
  abstract readonly order: Signal<OrderState>
  abstract loadById(query: GetOrderQuery): Promise<void>
}

class OrderStateServiceImpl extends OrderStateService {
  readonly order = signal<OrderState>({ status: 'loading' })

  constructor(
    private readonly readService: OrderReadService,
    private readonly errorManager: ErrorManager,
  ) {
    super()
  }

  async loadById(query: GetOrderQuery): Promise<void> {
    this.order.value = { status: 'loading' }
    try {
      const order = await this.readService.getById(query)
      this.order.value = { status: 'loaded', order }
    } catch (error) {
      this.order.value = { status: 'error', message: (error as Error).message }
      this.errorManager.handle(error as Error)
    }
  }
}
```

`ErrorManager` (see
[11-shared-services.md](11-shared-services.md#error-manager)) is how a
genuine failure gets surfaced app-wide (a toast, a log entry) in addition to
the local `error` state this one screen shows. Only route through it for
conditions that represent something actually going wrong — an expected,
navigable outcome (a 404-style "not found" from a bad slug/id) is still
just local state, not an `ErrorManager` report; see
[the domain errors rule](01-domain-layer.md#domain-errors-and-warnings-live-in-the-domain-not-the-application-layer)
for why "not found" is itself a domain error even though it's not reported
to `ErrorManager`.

Why put the signal in its own file instead of the read service itself (an
earlier iteration of this rule did exactly that): it keeps the read/write
services trivially reusable and testable with zero setup — anything that
needs `Promise<OrderReadModel>` can use `OrderReadService` directly, in a
script, a CLI, a different frontend, or a unit test, without dragging in a
reactive-primitives library it doesn't need. The state service is the one
place that concern is allowed to live, and it's easy to spot in a file
listing precisely because it's the only `.stateService.ts` file.

`signal()`/`computed()` from **`@preact/signals-core`** (not
`@preact/signals`) are plain reactive primitives with zero coupling to
component lifecycle or rendering — they work identically in a class, a
plain module, or a test, the same way an RxJS `Observable` or a hand-rolled
pub/sub would. This is why a state service depending on them still isn't a
framework dependency creeping into the application layer.

What makes them worth using specifically is that Preact's signals
integration auto-subscribes *any* component that reads a signal's `.value`
during render to re-render when it changes — regardless of whether that
signal was created with the `useSignal` hook or as a plain class field, as
it is here. The presentation hook becomes a thin adapter: trigger the load
on mount/param-change, forward the signal's current value.

```ts
// presentation/order/useOrderDetailsState.hook.ts
function useOrderDetailsState(orderId: string) {
  const stateService = container.get<OrderStateService>(TYPES.OrderStateService)

  useEffect(() => {
    stateService.loadById(new GetOrderQuery(orderId))
  }, [orderId])

  return stateService.order.value
}
```

### The Preact integration must be activated once, at the app root

`@preact/signals-core` alone has no idea Preact exists — it can't patch
Preact's rendering to auto-subscribe components. That patching is what
plain `@preact/signals` (no `-core`) does, as a side effect of being
imported anywhere in the running app; it doesn't matter which file does it.
Import it once, as a side effect, in the actual app root component (not
just the DOM-mounting entry point) — e.g. `import '@preact/signals'` at the
top of `app.tsx` — so it's active in every context that renders `<App />`,
including component tests that import `app.tsx` directly and never touch
`main.tsx`.

Skipping this doesn't error. Components silently render once with the
signal's initial value and never update again — a hard-to-diagnose bug that
looks like "the fetch never resolved" but is actually "the fetch resolved
and set `.value`, nothing was listening." If a state service's UI never
updates past its loading state, this is the first thing to check.

See [05-presentation-layer.md](05-presentation-layer.md) for how this
replaces the presentation-only state service, and
[08-tech-preact-typescript.md](08-tech-preact-typescript.md) for the full
pattern.

## Read models are optional for simple, read-only entities

A query handler CAN return a read model (DTO) — flattened,
presentation-friendly, no behavior, mapped from the domain object inside
the handler or a dedicated mapper — and this remains the right call for any
entity with behavior or mutable state, to keep the domain model's shape
free to evolve without breaking every screen that reads it and to avoid
handing presentation a live reference it could mutate through.

For an entity that's genuinely read-only (every field `public readonly`,
no behavior methods), a query handler MAY return the domain entity
directly instead — skip writing a DTO type and a mapper that would just
copy every field across unchanged. See
[05-presentation-layer.md](05-presentation-layer.md#read-models-are-optional--presentation-may-render-a-domain-entity-directly)
for the full trade-off and exactly which conditions tip it back toward a
proper read model.

## What an application service MUST NOT do

- Contain a business rule that isn't already, or shouldn't be, expressed on
  a domain object.
- Import an infrastructure class directly (only the port/interface).
- Import anything from presentation.
- Reach into another aggregate's internals instead of going through its own
  repository/root.
- Import a component, a hook, or anything that renders. Read/write services
  additionally have **zero library dependencies** at all — not even
  `@preact/signals-core`. Only the state service (see above) is allowed a
  reactive-primitives dependency; it still never imports
  `preact`/`preact/hooks`/JSX. Holding state reactively is fine; rendering
  is presentation's job.
