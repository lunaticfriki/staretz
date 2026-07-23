# Adaptation: Preact + TypeScript

Concrete mapping of the general rules onto a Preact + TypeScript project
(Vite-based, pnpm-managed).

## Folder tree (one vertical slice)

```
src/
  modules/
    ordering/
      domain/
        entities/
          Order.entity.ts
          __tests__/
            Order.entity.test.ts
            Order.mother.ts
        value-objects/
          OrderId.valueObject.ts
          OrderLine.valueObject.ts
          OrderStatus.valueObject.ts
          Money.valueObject.ts
        repositories/
          Order.repository.ts
        errors/
          OrderAlreadyConfirmed.error.ts
      application/
        command/
          ConfirmOrder.command.ts
          ConfirmOrder.commandHandler.ts
          __tests__/
            ConfirmOrder.commandHandler.test.ts
        query/
          GetOrder.query.ts
          GetOrder.queryHandler.ts
          __tests__/
            GetOrder.queryHandler.test.ts
        Order.readModel.ts
        Order.writeService.ts
        Order.readService.ts
        Order.stateService.ts
      infrastructure/
        HttpOrder.repository.ts
        acl/
          Order.mapper.ts
        __tests__/
          HttpOrder.repository.test.ts
      presentation/
        containers/
          OrderDetails.container.tsx
        components/
          OrderDetails.component.tsx
          OrderDetails.skeleton.tsx
        useOrderDetailsState.hook.ts
  shared/
    domain/
      Money.valueObject.ts
      Domain.error.ts
    di/
      types.ts
  composition-root.ts
```

File names follow `<Concept>.<kind>.ts` — see
[06-vertical-slicing.md](06-vertical-slicing.md#file-naming-convention) for
the full suffix table. `main.tsx`, `app.tsx`, `composition-root.ts`, and
`shared/di/types.ts` are exempt (entry-point/scaffold files, not one of the
named kinds).

## Domain: private constructors, factories

```ts
class OrderId {
  private constructor(public readonly value: string) {}

  static create(value: string): OrderId {
    if (!value) {
      throw new InvalidOrderIdError()
    }
    return new OrderId(value)
  }

  static generate(): OrderId {
    return new OrderId(crypto.randomUUID())
  }

  static empty(): OrderId {
    return new OrderId('')
  }

  toString(): string {
    return this.value
  }
}
```

## Application: CQRS handlers, read/write/state services split

Ports and application-service contracts are `abstract class`, not
`interface` (see
[01-domain-layer.md](01-domain-layer.md#typescript-abstract-classes-not-interfaces-for-contracts)).

Three files, three responsibilities — see
[03-application-layer-cqrs.md](03-application-layer-cqrs.md#readwrite-services-stay-pure-a-state-service-holds-the-signal)
for the full reasoning:

- `Order.readService.ts` / `Order.writeService.ts` — **zero library
  dependencies**. Plain classes wrapping query/command handlers, returning
  `Promise`s.
- `Order.stateService.ts` — the only file with a `@preact/signals-core`
  dependency. Holds the `Signal`, composes the read/write services, reports
  genuine failures to `ErrorManager`.

```ts
// Order.readService.ts — no library dependencies
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
// Order.writeService.ts — no library dependencies
abstract class OrderWriteService {
  abstract confirm(command: ConfirmOrderCommand): Promise<void>
}

class OrderWriteServiceImpl extends OrderWriteService {
  constructor(private readonly handler: ConfirmOrderCommandHandler) {
    super()
  }

  confirm(command: ConfirmOrderCommand): Promise<void> {
    return this.handler.handle(command)
  }
}
```

```ts
// Order.stateService.ts — the only file with a signals dependency
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

Containers depend on `OrderStateService` (and `OrderWriteService` directly
for command dispatch), never on the handler classes, `OrderReadService`, or
infrastructure directly — `OrderReadService` is `OrderStateService`'s
dependency, not the container's.

## Presentation: a thin adapter over the state service's signal

The hook's only job is to trigger a load when its params change and
forward the signal's current value — it doesn't hold its own
`useState`/`useSignal` copy of anything.

```ts
function useOrderDetailsState(orderId: string) {
  const stateService = container.get<OrderStateService>(TYPES.OrderStateService)

  useEffect(() => {
    stateService.loadById(new GetOrderQuery(orderId))
  }, [orderId])

  return stateService.order.value
}
```

Reading `stateService.order.value` here — inside the hook body, which runs
during the component's render — is what makes the component reactive: as
long as `@preact/signals`' Preact integration has been activated somewhere
in the app (see the next section), this component automatically re-renders
whenever `loadById` updates `order.value`, with no `useState`/`useSignal`
call in this file at all.

`stateService` is pulled from the DI container inside the hook — containers
never import infrastructure to construct it.

## Activating the Preact/signals integration

`@preact/signals-core` (used above, in the application layer) has no
Preact awareness — it can't make a component re-render on its own. That's
what plain `@preact/signals` does, as a side effect of being imported
anywhere in the running app. Import it once, at the actual app root
component — not just the DOM-mounting entry point:

```ts
// app.tsx
import '@preact/signals'

import { Router } from 'preact-router'
// ...

export function App() {
  /* ... */
}
```

Put it in `app.tsx` rather than `main.tsx` specifically so it's active in
every context that renders `<App />`, including component tests that
import `app.tsx` directly via `@testing-library/preact` and never touch
`main.tsx`. Skipping this doesn't throw an error — components silently
render once with the signal's initial value and never update again, which
looks like a stuck fetch but is actually "nothing is listening." If a
screen's UI never progresses past its loading skeleton, check this first.

## Composition root: InversifyJS

`inversify` is the standard DI container for TypeScript projects in this
stack. One container is built at the composition root; every port
(repository contract, application service contract — both `abstract class`,
see above) is bound to its concrete implementation there, and presentation
code resolves what it needs by symbol token instead of constructing or
importing concretes directly.

```ts
// shared/di/types.ts
export const TYPES = {
  OrderRepository: Symbol.for('OrderRepository'),
  OrderReadService: Symbol.for('OrderReadService'),
  OrderWriteService: Symbol.for('OrderWriteService'),
  OrderStateService: Symbol.for('OrderStateService'),
  ErrorManager: Symbol.for('ErrorManager'),
  // ...NotificationService, NotificationStateService — see 11-shared-services.md
}
```

```ts
// composition-root.ts
import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './shared/di/types'

const container = new Container()

container
  .bind<OrderRepository>(TYPES.OrderRepository)
  .toDynamicValue(() => new HttpOrderRepository(new FetchHttpClient(import.meta.env.VITE_API_URL)))
  .inSingletonScope()

container
  .bind<OrderReadService>(TYPES.OrderReadService)
  .toDynamicValue(
    (context) => new OrderReadServiceImpl(new GetOrderQueryHandler(context.get(TYPES.OrderRepository))),
  )
  .inSingletonScope()

container
  .bind<OrderWriteService>(TYPES.OrderWriteService)
  .toDynamicValue(
    (context) => new OrderWriteServiceImpl(new ConfirmOrderCommandHandler(context.get(TYPES.OrderRepository))),
  )
  .inSingletonScope()

// ErrorManager, NotificationService, NotificationStateService bound here too —
// see 11-shared-services.md for that wiring.

container
  .bind<OrderStateService>(TYPES.OrderStateService)
  .toDynamicValue(
    (context) => new OrderStateServiceImpl(
      context.get(TYPES.OrderReadService),
      context.get(TYPES.ErrorManager),
    ),
  )
  .inSingletonScope()

export { container }
```

### Why `toDynamicValue` instead of decorator-based auto-wiring

Inversify's classic pattern — `@injectable()` on a class, `@inject(TOKEN)` on
each constructor parameter, `container.bind(X).to(ConcreteClass)` resolving
the constructor automatically — requires TypeScript's
`emitDecoratorMetadata`, which reads whole-program type information to emit
`design:paramtypes`. Vite's default TS handling goes through **esbuild**,
which strips types per-file and does not (and cannot, by design — it has no
type checker) emit that metadata. Under a plain `@preact/preset-vite`
project, decorator-based constructor injection silently breaks at runtime.

Binding with `toDynamicValue` sidesteps this entirely: the factory function
explicitly pulls each dependency off `context.get(...)` and constructs the
instance itself. No decorators, no metadata, no esbuild incompatibility —
just an explicit, fully-typed factory per binding. `import 'reflect-metadata'`
is still required once at the composition root (Inversify's container
internals call `Reflect.getMetadata` regardless of whether you use
decorators yourself), but no `experimentalDecorators` or
`emitDecoratorMetadata` tsconfig flags are needed.

If a project later moves off esbuild-based TS handling (e.g. a Babel
pipeline with `babel-plugin-transform-typescript-metadata`), decorator-based
binding becomes viable — but `toDynamicValue` has no downside that justifies
that extra build complexity for most projects, so it's the default here.

## Tooling

- Test runner: `vitest`.
- Mocking ports: `ts-mockito`.
- Dependency injection: `inversify` (see above).
- Reactive state: `@preact/signals-core`, isolated to each feature's
  `.stateService.ts` only — read/write services stay dependency-free.
  `@preact/signals` imported once at the app root to activate Preact
  re-rendering (see above).
- Error/notification handling: `ErrorManager` + `NotificationService` in
  `shared/` (see [11-shared-services.md](11-shared-services.md)).
- Arch tests: `dependency-cruiser`, run via `pnpm arch-test` as its own CI
  step (see [07-testing-strategy.md](07-testing-strategy.md)).
- Component tests: `@testing-library/preact`.
- No comments in source — types and names carry meaning; JSDoc is only used
  where a published library's public API needs it.
