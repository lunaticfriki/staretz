# Glossary

**Aggregate** — a cluster of entities/value objects treated as one
consistency boundary, accessed only through its aggregate root.

**Anti-Corruption Layer (ACL)** — infrastructure code that translates an
external system's shape (API response, DB row, markdown file, Firestore
document) into domain objects and back, so external concepts never leak
into the domain. Lives in its own `infrastructure/acl/` folder — see
[04-infrastructure-layer.md](04-infrastructure-layer.md).

**Aggregate root** — the single entity through which the rest of an
aggregate is reached and modified.

**Arch test** — an automated test that enforces the dependency rule between
layers/modules (e.g. domain never imports infrastructure), run in CI.

**Command** — a request to change state. Handled by a write service/command
handler. Returns no read model.

**Composition root** — the single place in an app where concrete
infrastructure adapters are instantiated and wired into the application
services that need them.

**DI container** — a registry mapping service identifiers (symbol tokens) to
concrete implementations, resolved at the composition root. InversifyJS is
the standard choice for TypeScript projects here; bindings use
`toDynamicValue` factories rather than decorator-based auto-wiring (see
[08-tech-preact-typescript.md](08-tech-preact-typescript.md)).

**Container** — a presentation-layer unit that reads state (via the state
service) and dispatches commands/queries, choosing which component to render
based on status.

**Component** — a pure, presentation-only unit that receives props and
renders markup, with no knowledge of application/domain/infrastructure.

**Domain error** — a typed exception (`extends DomainError`) representing a
broken invariant or a notable outcome (e.g. "not found") that stops the
current operation. Declared in the domain layer even when an application
handler is what detects it — see
[01-domain-layer.md](01-domain-layer.md#domain-errors-and-warnings-live-in-the-domain-not-the-application-layer).

**Domain warning** — a typed exception (`extends DomainWarning`) for a
notable-but-non-fatal condition (a degraded-but-working state). Same rules
as a domain error otherwise; `ErrorManager` uses `instanceof DomainWarning`
to show it as a warning rather than an error.

**Error Manager** — the shared service that turns a caught
`DomainError`/`DomainWarning` into a user-facing notification. Stateless
itself; delegates to `NotificationStateService` — see
[11-shared-services.md](11-shared-services.md#error-manager).

**Domain service** — domain logic that spans more than one aggregate or
doesn't naturally belong to a single entity.

**Entity** — a domain object with identity that persists across state
changes; equality is by identity, not attributes.

**Feature file** — a `.feature` file written in Gherkin (Given/When/Then),
describing user-facing behavior for an end-to-end test — see
[12-e2e-testing.md](12-e2e-testing.md).

**Step definition** — the code implementing one Given/When/Then line from a
feature file, matched by Cucumber at runtime; small and reused across
scenarios rather than written one-per-scenario.

**Cucumber World** — the object instantiated fresh per scenario that step
definitions share state through (here, the Playwright `Page`) — see
[12-e2e-testing.md](12-e2e-testing.md#the-world-and-hooks).

**Hexagonal architecture (Ports & Adapters)** — an architecture where the
domain/application core defines contracts (ports) for what it needs, and
outer layers (infrastructure, presentation) provide/consume implementations
(adapters), with dependencies pointing inward only.

**Notification Service** — the shared service that constructs `Notification`
entities; paired with `NotificationStateService`, which holds the reactive
list a `NotificationCenter` component renders — see
[11-shared-services.md](11-shared-services.md#notification-service).

**Object Mother** — a test-only factory class that builds valid, named
fixture instances of a domain object (`random()`, `empty()`,
`confirmed()`, ...), replacing ad-hoc literals in tests.

**Port** — a contract declared by an inner layer (usually domain, sometimes
application) describing a capability it needs, implemented by an outer
layer. In TypeScript this is an `abstract class`, not an `interface` — see
[01-domain-layer.md](01-domain-layer.md#typescript-abstract-classes-not-interfaces-for-contracts).

**Query** — a request to read state. Handled by a read service/query
handler. Returns a read model, never mutates.

**Read model** — a DTO shaped for a specific read use, returned by a query
handler; not a domain object and has no behavior. Optional for a read-only
entity (no behavior, no mutable state) — the query can return the domain
entity directly instead; see
[05-presentation-layer.md](05-presentation-layer.md#read-models-are-optional--presentation-may-render-a-domain-entity-directly).

**Read/write service** — the CQRS grouping of an aggregate's query handlers
(`XReadService`) versus its command handlers (`XWriteService`), exposed as
two distinct contracts.

**Skeleton** — a loading-state placeholder component mirroring the layout of
the component it stands in for.

**State service** — the reactive state holder a container subscribes to.
In Preact, this is its own file (`<Concept>.stateService.ts`), separate
from the pure `<Concept>.readService.ts`/`<Concept>.writeService.ts` it
composes — the only file with a `Signal` (`@preact/signals-core`)
dependency; the presentation hook is a thin adapter.

**Value object** — a domain object with no identity, defined entirely by its
attributes, immutable, compared structurally.

**Vertical slicing** — organizing folders by feature/bounded context first,
by architectural layer second.
