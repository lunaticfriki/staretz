# Domain Layer

The domain layer is the core. It has zero dependencies on application,
infrastructure, presentation, or any framework/library beyond a minimal
standard runtime. Everything else in the system depends on it; it depends on
nothing.

## What belongs here

- Entities and aggregates
- Value objects
- Domain services (logic that doesn't naturally belong to a single entity)
- Repository interfaces (ports) — the domain declares what it needs
  persisted/fetched, infrastructure decides how
- Domain events (when relevant)
- Domain errors (typed exceptions representing broken invariants)

## What does NOT belong here

- Framework types (HTTP request/response, DB rows, UI props)
- Serialization/formatting concerns
- Orchestration of multiple aggregates/repositories (that's application layer)
- Anything that changes because a library changed, not because the business
  rules changed

## Folder structure within the domain layer

The domain folder is itself split by concept, not left as a flat file
listing:

```
domain/
  entities/
    Post.entity.ts
    __tests__/
      Post.entity.test.ts
      Post.mother.ts
  value-objects/
    Slug.valueObject.ts
    PostTitle.valueObject.ts
    PostAuthor.valueObject.ts
  repositories/
    Post.repository.ts
  errors/
    PostNotFound.error.ts
```

File names follow `<Concept>.<kind>.ts` throughout — see
[06-vertical-slicing.md](06-vertical-slicing.md#file-naming-convention) for
the full suffix table.

- `entities/` — entities and aggregate roots.
- `value-objects/` — value objects.
- `repositories/` — repository ports (abstract classes, see below).
- `errors/` — condition/outcome errors and warnings not tied to one value
  object (see
  [below](#domain-errors-and-warnings-live-in-the-domain-not-the-application-layer)).
  A value object's own validation error stays in the VO's file, not here.
- `collections/` — a **collection** wraps a set of entities and owns
  collection-level domain behavior (ordering, filtering, limiting) as
  methods, instead of that logic leaking into an application handler as ad
  hoc array `.sort()`/`.filter()` calls. Immutable like a value object —
  methods return a new collection rather than mutating in place — and
  exposes `toArray()` as the one sanctioned exit point for a layer (usually
  presentation) that needs a plain array. Only worth introducing once a
  collection has real behavior beyond just being a list; a repository
  method that returns a plain `Post[]` with no shared ordering/filtering
  logic doesn't need one.
- More categories are added as they're needed (`services/` for domain
  services, `events/` for domain events) — the point is every concept gets
  its own folder instead of accumulating as same-level files.
- Tests and Object Mothers live in a `__tests__/` folder co-located with
  what they test (`entities/__tests__/`, not a top-level test tree) — see
  [07-testing-strategy.md](07-testing-strategy.md).

## No primitives in the domain

A raw `string`, `number`, or `boolean` in a domain model is a missed
invariant. If a concept has meaning in the ubiquitous language — an email, a
price, a user id, a date range — it MUST be a value object, not a primitive
passed around and validated in five different places.

Rule of thumb: if you'd validate the same string format/range in more than
one place, it's a value object you haven't extracted yet.

## Private constructors + factory methods

Entities and value objects MUST NOT expose a public constructor. Construction
goes through static factory methods so that invariants are enforced at the
single point of creation and invalid states are unrepresentable.

Two factory methods are standard:

- `create(...)` — validates input, throws/returns a failure for invalid data,
  returns a valid instance otherwise.
- `empty()` — returns a neutral/default instance used as an initial or
  null-object value (e.g. initial state before data loads, a "no selection"
  placeholder). It is a legitimate domain concept, not a workaround — only add
  it when the domain genuinely has a meaningful empty/unset state.

### TypeScript: public readonly fields, not private + getters

In TypeScript specifically, a field that is set once at construction and
never reassigned MUST be declared `public readonly`, not `private` with a
`getXxx()` wrapper method. The getter-method pattern is boilerplate left
over from languages without `readonly` — TypeScript already gives callers
compile-time immutability on a public field, so a method that does nothing
but `return this.x` adds a call site (`order.getId()`) with no benefit over
a property (`order.id`).

This does NOT apply to fields a class mutates internally after construction
to protect an invariant (e.g. an aggregate's `status` changing through a
`confirm()` method). Those must stay `private` — a mutable field can never
be `public`, readonly or not, without letting external code bypass the
method that guards the invariant. Expose read access to those with a TS
`get` accessor (`get status()`), not a `getStatus()` method, so the call
site still reads as a plain property (`order.status`) regardless of whether
a field is fixed at construction or internally computed/mutated.

```ts
class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    if (!Email.isValid(value)) {
      throw new InvalidEmailError(value)
    }
    return new Email(value)
  }

  static empty(): Email {
    return new Email('')
  }

  private static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
```

```ts
class Order {
  private _lines: OrderLine[]
  private _status: OrderStatus

  private constructor(
    public readonly id: OrderId,
    public readonly customerId: CustomerId,
    lines: OrderLine[],
    status: OrderStatus,
  ) {
    this._lines = lines
    this._status = status
  }

  static create(customerId: CustomerId): Order {
    return new Order(OrderId.generate(), customerId, [], OrderStatus.draft())
  }

  static empty(): Order {
    return new Order(OrderId.empty(), CustomerId.empty(), [], OrderStatus.draft())
  }

  get lines(): OrderLine[] {
    return this._lines
  }

  get status(): OrderStatus {
    return this._status
  }

  addLine(line: OrderLine): void {
    if (this._status.isConfirmed()) {
      throw new CannotModifyConfirmedOrderError(this.id)
    }
    this._lines = [...this._lines, line]
  }
}
```

`id`/`customerId` are fixed at construction, so they're plain `public
readonly` fields. `lines`/`status` change through `addLine`/a hypothetical
`confirm()`, so the backing fields are private (`_lines`/`_status`) with a
`get` accessor exposing them — callers still read `order.lines`/
`order.status` like a property either way.

## Entities vs value objects

- **Entity**: has identity that persists across state changes (`OrderId`
  stays the same as an order's lines change). Equality is by identity.
- **Value object**: has no identity, defined entirely by its attributes.
  Equality is structural. Immutable — mutation methods return a new instance
  rather than mutating in place.
- **Aggregate**: a cluster of entities/value objects with one designated
  aggregate root, which is the only object referenced from outside the
  aggregate and the only one exposing behavior that touches the whole
  cluster's invariants.

## Domain services

When behavior involves more than one aggregate, or doesn't naturally belong
to any single entity, it becomes a domain service — still pure domain logic,
still zero infrastructure dependencies, just not a method on one entity.

```ts
class PricingPolicy {
  applyDiscount(order: Order, customer: Customer): Money {
    if (customer.isLoyalCustomer() && order.total().isAbove(Money.create(100))) {
      return order.total().percentageOff(10)
    }
    return order.total()
  }
}
```

## Repository ports live in the domain

The domain declares the contract for persistence as a port. It knows
nothing about SQL, HTTP, or the filesystem — only the shape of what it
needs.

In TypeScript, ports are declared as `abstract class`, not `interface` —
see [the TS-specific rule below](#typescript-abstract-classes-not-interfaces-for-contracts)
for why.

```ts
abstract class OrderRepository {
  abstract findById(id: OrderId): Promise<Order | null>
  abstract save(order: Order): Promise<void>
}
```

Infrastructure extends this class. See
[02-hexagonal-architecture.md](02-hexagonal-architecture.md).

## TypeScript: abstract classes, not interfaces, for contracts

Any TypeScript type that represents a behavioral contract — a port
(repository, external-service interface) or an application service exposed
to presentation — MUST be declared as `abstract class`, not `interface`.
Concrete implementations `extend` it instead of `implements`-ing it.

Why: a TypeScript `interface` is erased entirely at compile time — it has
no runtime representation at all. An `abstract class` does: it's a real
class in the compiled output (you just can't `new` it directly), which
means it can be used as a value where a real one is needed — most notably
as a dependency-injection token (see
[08-tech-preact-typescript.md](08-tech-preact-typescript.md)'s InversifyJS
section), or in an `instanceof` check. Interfaces can't do either. Given TS
otherwise treats the two identically for structural type-checking purposes,
the abstract class costs nothing and keeps the door open.

This rule does NOT apply to plain data shapes — read models, command/query
payloads, prop bags. Those aren't contracts meant to be implemented or
extended; they're flat records, and `interface` (or `type`) remains the
right tool. Reach for `abstract class` specifically when multiple classes
could plausibly satisfy the same contract (a fake repository today, a real
one tomorrow) or when the type needs a runtime identity.

```ts
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

## Object Mothers

Test data construction goes through Object Mother classes, not inline
literals repeated across test files. An Object Mother knows how to build a
valid, representative instance with sensible defaults, and offers named
variants for specific scenarios.

```ts
class OrderMother {
  static random(): Order {
    const order = Order.create(CustomerMother.random().id())
    order.addLine(OrderLineMother.random())
    return order
  }

  static empty(): Order {
    return Order.empty()
  }

  static confirmed(): Order {
    const order = OrderMother.random()
    order.confirm()
    return order
  }
}
```

Rules:

- One Object Mother per aggregate/entity/value object that's meaningfully
  used across tests.
- Methods return fully valid instances by default (`random()`), plus named
  variants for edge cases (`confirmed()`, `withoutLines()`, `expired()`).
- Object Mothers live alongside tests (e.g.
  `domain/entities/__tests__/Order.mother.ts`) and are never imported by
  production code.
- Prefer composing Object Mothers over duplicating construction logic
  (`OrderMother` uses `CustomerMother`, not a hand-rolled customer).

## Domain errors and warnings live in the domain, not the application layer

Broken invariants throw typed domain errors, not generic `Error`. This keeps
error handling in the application layer explicit and testable.

```ts
class InvalidEmailError extends DomainError {
  constructor(value: string) {
    super(`"${value}" is not a valid email`)
  }
}
```

Two base types, both in `shared/errors/domain/`:

```ts
// shared/errors/domain/Domain.error.ts
export abstract class DomainError extends Error {}

// shared/errors/domain/Domain.warning.ts
export abstract class DomainWarning extends Error {}
```

`DomainError` is for conditions that stop the current operation (an invalid
value object, a "not found" outcome, an invariant violation). `DomainWarning`
is for conditions worth surfacing to the user but that don't stop anything —
a degraded-but-working state (falling back to cached data, an optional
field left unset). Both extend `Error` so they carry a message and work
with `instanceof`; [`ErrorManager`](11-shared-services.md#error-manager)
uses that `instanceof` check to decide whether something is reported as a
warning or an error.

**Errors and warnings belong in the domain layer, not application** — even
when the application layer is what actually detects the condition. A "post
not found" error is thrown from a query handler after a repository call
returns `null`, but the *type* still lives in domain, because "no post
exists at this slug" is a statement about the domain, not an artifact of
how the application layer happens to be wired:

```ts
// domain/errors/PostNotFound.error.ts
import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class PostNotFoundError extends DomainError {
  constructor(slug: string) {
    super(`Post with slug "${slug}" not found`)
  }
}
```

```ts
// application/query/GetPostBySlug.queryHandler.ts
import { PostNotFoundError } from '../../domain/errors/PostNotFound.error'

class GetPostBySlugQueryHandler {
  async handle(query: GetPostBySlugQuery): Promise<PostReadModel> {
    const post = await this.posts.findBySlug(Slug.create(query.slug))
    if (!post) {
      throw new PostNotFoundError(query.slug)
    }
    return toPostReadModel(post)
  }
}
```

Two different kinds of error live in two different places, and both are
domain, not application:

- **Value object validation errors** (`InvalidSlugError`,
  `InvalidEmailError`) stay co-located in the same file as the value object
  that throws them — no separate folder, they're small and 1:1 with their
  VO.
- **Condition/outcome errors** that aren't tied to one value object
  (`PostNotFoundError`, `OrderAlreadyConfirmedError`) get their own
  `domain/errors/` folder, alongside `entities/`, `value-objects/`,
  `repositories/` (see
  [06-vertical-slicing.md](06-vertical-slicing.md#file-naming-convention)).

Not every failure needs to reach the user through
[`ErrorManager`](11-shared-services.md) — an expected, navigable outcome
like "not found" is typically just local state a screen renders directly
(a "Post not found" view), not something that pops a toast. Route through
`ErrorManager` for conditions that represent something actually going
wrong, not for expected branches of normal navigation.
