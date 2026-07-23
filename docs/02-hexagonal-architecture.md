# Hexagonal Architecture (Ports & Adapters)

Four layers, one dependency rule: **dependencies point inward, always.**
Nothing inward-facing knows that anything outward-facing exists.

```
presentation  ──depends on──▶  application  ──depends on──▶  domain
                                     ▲
infrastructure ──implements ports declared in── domain / application
```

## The four layers

### Domain (the core)
Zero outward dependencies. See [01-domain-layer.md](01-domain-layer.md).
Declares ports (repository contracts, external-service contracts) as
abstract classes in TypeScript — it defines *what* it needs, never *how*
it's provided.

### Application
Orchestrates domain objects to fulfill a command or answer a query. Depends
only on domain. Talks to the outside world exclusively through ports (the
contracts domain declared) — never imports a concrete infrastructure class
directly. See [03-application-layer-cqrs.md](03-application-layer-cqrs.md).

### Infrastructure
Adapters. Implements the ports declared by domain/application: repository
implementations, HTTP clients, storage, third-party SDK wrappers. Also owns
the **Anti-Corruption Layer (ACL)** — the translation code that converts an
external system's shape (a raw API response, a markdown file, a Firestore
document) into domain objects, so external concepts never leak past
infrastructure. Depends on domain (to extend its ports) and may depend on
application only for wiring/DI registration — never the other way around.
See [04-infrastructure-layer.md](04-infrastructure-layer.md).

### Presentation
UI and its glue code: containers, components, state service. Depends on
application (dispatches commands, runs queries) — MUST NOT import
infrastructure directly. If presentation needs a concrete adapter, it's
wired through dependency injection at the composition root, not imported
inline. See [05-presentation-layer.md](05-presentation-layer.md).

## Ports and adapters, concretely

A **port** is a contract owned by the inner layer that needs the capability
(usually domain, sometimes application for things like a notification
sender). An **adapter** is the concrete implementation, owned by
infrastructure, injected wherever the port is required. In TypeScript,
ports are `abstract class`, not `interface` — see
[01-domain-layer.md](01-domain-layer.md#typescript-abstract-classes-not-interfaces-for-contracts)
for why.

```ts
// domain/repositories/Order.repository.ts — port
abstract class OrderRepository {
  abstract findById(id: OrderId): Promise<Order | null>
  abstract save(order: Order): Promise<void>
}

// infrastructure/HttpOrder.repository.ts — adapter
class HttpOrderRepository extends OrderRepository {
  constructor(private readonly httpClient: HttpClient) {
    super()
  }

  async findById(id: OrderId): Promise<Order | null> {
    const response = await this.httpClient.get(`/orders/${id.toString()}`)
    return response ? OrderMapper.toDomain(response) : null
  }

  async save(order: Order): Promise<void> {
    await this.httpClient.put(`/orders/${order.id.toString()}`, OrderMapper.toPersistence(order))
  }
}
```

Presentation never sees `HttpOrderRepository`. It only ever depends on
`OrderRepository` through an application service, wired at the composition
root (app bootstrap / DI container setup).

## Why this shape

- The domain is testable with zero mocks (see
  [07-testing-strategy.md](07-testing-strategy.md)) — pure functions and
  objects, no I/O.
- Swapping infrastructure (REST to GraphQL, SQL to a document store, a
  third-party SDK migration) never touches domain or application code.
- Swapping the UI framework (Preact to something else) never touches domain,
  application, or infrastructure.

## Enforcing the rule

Documentation and code review are not enough on their own — layer
violations creep in under deadline pressure. Import-boundary rules MUST be
enforced by arch tests running in CI. See
[07-testing-strategy.md](07-testing-strategy.md) for the concrete setup.

The rule set, precisely:

- `domain` imports nothing from `application`, `infrastructure`, or
  `presentation`.
- `application` imports only from `domain`.
- `infrastructure` imports only from `domain` (to implement its interfaces);
  it MAY depend on `application`'s port definitions if a port is declared
  there instead of domain, but never on `presentation`.
- `presentation` imports only from `application` (commands, queries, their
  results/DTOs) — never `infrastructure` directly.
- Wiring (constructing concrete adapters and injecting them into application
  services) happens at a single composition root, not scattered through the
  codebase.
