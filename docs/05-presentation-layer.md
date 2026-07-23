# Presentation Layer

Presentation renders state and dispatches user intent. It depends on the
application layer (commands/queries and their read models) and MUST NOT
import infrastructure directly. It holds UI state and rendering logic —
never business rules.

## Containers vs components

- **Container**: knows about the state service and application layer. Reads
  reactive state, dispatches commands/queries, decides what to render based
  on state (loading/error/loaded), and passes plain props down. No markup
  beyond composing components and picking the loading/error/loaded branch.
- **Component**: pure, presentation-only. Receives props, renders markup,
  emits events upward via callbacks. Has no knowledge of the state service,
  application layer, or domain. Trivial to test in isolation and reuse.

```tsx
// presentation/order/containers/OrderDetails.container.tsx
function OrderDetailsContainer({ orderId }: { orderId: string }) {
  const state = useOrderDetailsState(orderId)

  if (state.status === 'loading') {
    return <OrderDetailsSkeleton />
  }

  if (state.status === 'error') {
    return <OrderDetailsError message={state.message} />
  }

  return (
    <OrderDetails
      order={state.order}
      onConfirm={() => state.confirm()}
    />
  )
}
```

```tsx
// presentation/order/components/OrderDetails.component.tsx
function OrderDetails({ order, onConfirm }: OrderDetailsProps) {
  return (
    <section>
      <h2>{order.customerName}</h2>
      <OrderLineList lines={order.lines} />
      <button type="button" onClick={onConfirm}>
        Confirm order
      </button>
    </section>
  )
}
```

`OrderDetails` never imports the state service or any application type
directly — its props are a plain read model shape, making it framework- and
layer-agnostic to test and reuse (e.g. in a style guide/storybook).

## Skeletons

Every container that loads data owns a skeleton component shown while state
is `loading`. Skeletons mirror the real component's layout (same regions,
placeholder blocks instead of content) so the transition from loading to
loaded doesn't jump. Skeletons live next to the component they shadow:

```
presentation/order/
  components/
    OrderDetails.component.tsx
    OrderDetails.skeleton.tsx
  containers/
    OrderDetails.container.tsx
```

## State service

The state service is the reactive holder of "what should the UI currently
show" that a container subscribes to, built on top of application
queries/commands.

Responsibilities:

- Expose loaded data plus a `status` (`idle | loading | loaded | error`).
- Update after a command runs (re-run the query, or apply an optimistic
  update).
- Hold no business logic — it only decides *when* to call application
  services and *how* to shape loading/error state for the UI, never *whether*
  a business rule is satisfied.

In Preact, the reactive state lives in a dedicated *state service* in the
application layer — `Order.stateService.ts`, separate from the pure
`Order.readService.ts`/`Order.writeService.ts` — holding a `Signal` from
`@preact/signals-core` (framework-agnostic; see
[03-application-layer-cqrs.md](03-application-layer-cqrs.md#readwrite-services-stay-pure-a-state-service-holds-the-signal)).
The presentation hook is a thin adapter: it triggers a load and forwards
the signal's value, nothing more.

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

See [08-tech-preact-typescript.md](08-tech-preact-typescript.md) for the
full pattern, including the read/state service split and the one-time
`@preact/signals` import required at the app root to make Preact actually
re-render on signal changes: a single reactive state holder per
feature/screen that containers subscribe to, sitting between the UI and
the rest of the app.

## Read models are optional — presentation may render a domain entity directly

The default used to be: a query handler always maps its result to a read
model DTO before it leaves the application layer, so presentation never
sees a domain type. That's still the right call for an entity with
behavior or mutable state (see below) — but for a genuinely read-only
entity (every field `public readonly`, no methods that change anything),
mapping to a hand-written DTO is pure ceremony. It's fine to return the
entity itself from the read/state service and let presentation render its
value-object fields with `.toString()` (or a small formatter, for things
like a date):

```tsx
function PostPreview({ post }: { post: Post }) {
  return (
    <article>
      <h2>{post.title.toString()}</h2>
      <p>{post.author.toString()} · {formatPublishedAt(post.publishedAt)}</p>
    </article>
  )
}
```

This is a deliberate, narrow trade: presentation now imports a domain type
(`Post`) directly, which is a real deviation from "presentation depends on
application only" — accept it specifically because `Post` here is
immutable and behavior-free, so there's nothing presentation could
accidentally trigger by holding a reference to it. Reach for a proper read
model DTO instead when any of these hold:

- The entity has behavior (`order.confirm()`) — handing presentation a live
  reference risks it calling a mutating method directly, bypassing the
  write service.
- The entity is mutable internally (private fields behind a `get`
  accessor) — same risk, plus the read model can safely be a frozen
  snapshot where the entity can't.
- The read shape genuinely diverges from the domain shape — aggregating
  fields from more than one entity, flattening nested value objects
  differently than the domain model does.

`Order` (the running example throughout these docs) is intentionally kept
as the "needs a read model" case for this reason — it has both behavior and
mutable state.

## What presentation MUST NOT do

- Import infrastructure directly (a concrete repository, an HTTP client).
- Contain business rules (e.g. "an order over $100 gets free shipping" is a
  domain rule, not a component conditional).
- Construct domain entities directly — presentation only ever sees read
  models (DTOs) coming back from queries.
