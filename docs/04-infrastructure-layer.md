# Infrastructure Layer

Infrastructure implements the ports declared by the domain (and
occasionally the application layer). It is the only layer allowed to know
about HTTP clients, SQL, filesystems, third-party SDKs, browser storage, or
platform channels.

## What belongs here

- Repository implementations (`HttpOrderRepository`, `SqliteOrderRepository`,
  `InMemoryOrderRepository` for tests)
- The Anti-Corruption Layer (ACL) — mappers/translators between domain
  objects and external wire/persistence shapes (see below)
- Wrappers around third-party SDKs, so the rest of the app depends on our own
  port, not the SDK's API surface
- Configuration for the above (base URLs, connection strings) — read from
  environment/config, never hardcoded

## Folder structure

```
infrastructure/
  HttpOrder.repository.ts
  acl/
    Order.mapper.ts
  __tests__/
    HttpOrder.repository.test.ts
```

## The Anti-Corruption Layer (ACL)

An Anti-Corruption Layer is the translation code that converts an external
system's model — a raw API response, a database row, a markdown file, a
Firestore document — into domain objects, and back. It's what keeps an
external system's vocabulary and shape from leaking past infrastructure and
contaminating the domain model. It lives in its own `acl/` folder within
infrastructure, separate from the repository implementation that uses it —
the repository orchestrates fetching/persisting; the ACL mapper owns the
translation.

Domain objects are constructed through their `create`/`empty` factories
from the ACL mapper — it never bypasses domain construction rules to build
an entity "cheaply."

```ts
// infrastructure/acl/Order.mapper.ts
class OrderMapper {
  static toDomain(dto: OrderApiResponse): Order {
    const order = Order.create(CustomerId.create(dto.customerId))
    dto.lines.forEach((line) => order.addLine(OrderLineMapper.toDomain(line)))
    if (dto.status === 'confirmed') {
      order.confirm()
    }
    return order
  }

  static toPersistence(order: Order): OrderApiPayload {
    return {
      customerId: order.customerId.toString(),
      lines: order.lines.map(OrderLineMapper.toPersistence),
      status: order.status.toString(),
    }
  }
}
```

If a repository combines multiple external sources (a cache plus a network
call), that composition still lives in the repository — the ACL mapper only
ever translates one external shape to/from one domain shape, so it stays
reusable and easy to test in isolation.

## One implementation per port, swappable

Because application/domain depend on the port, infrastructure can offer
multiple implementations behind the same port — a real HTTP-backed
repository for production, an in-memory one for tests, a local-storage-backed
one for offline mode — without either inner layer changing. In TypeScript,
the port is an `abstract class` (see
[01-domain-layer.md](01-domain-layer.md#typescript-abstract-classes-not-interfaces-for-contracts)),
so implementations `extend` it rather than `implements`-ing it.

```ts
class InMemoryOrderRepository extends OrderRepository {
  private readonly orders = new Map<string, Order>()

  async findById(id: OrderId): Promise<Order | null> {
    return this.orders.get(id.toString()) ?? null
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id.toString(), order)
  }
}
```

## What infrastructure MUST NOT do

- Contain business rules (a discount calculation, a status transition
  check) — that belongs in domain.
- Be imported directly by presentation. Presentation depends on application;
  application depends on the port; infrastructure is wired in at the
  composition root (DI container setup, app bootstrap).
- Construct domain entities by reaching past their factories (no
  `new Order(...)`, no setting private fields via casts/reflection).

## Composition root

Somewhere in the app (bootstrap file, DI container registration module) the
concrete infrastructure adapters are instantiated and handed to the
application services that need them. This is the one place allowed to
import both infrastructure and application/domain together.

```ts
const orderRepository: OrderRepository = new HttpOrderRepository(httpClient)
const confirmOrder = new ConfirmOrderCommandHandler(orderRepository)
const getOrder = new GetOrderQueryHandler(orderRepository)

container.register('OrderWriteService', confirmOrder)
container.register('OrderReadService', getOrder)
```
