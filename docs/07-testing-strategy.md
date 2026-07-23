# Testing Strategy

Testing mirrors the layers: the domain is tested with no mocks at all, the
application layer is tested by mocking ports, and infrastructure is
tested with real or containerized dependencies. Presentation (containers
and components) has **no unit tests** — see
[below](#presentation-is-not-unit-tested) for why. Architecture rules are
enforced by dedicated arch tests, not just convention.

## Domain tests — no mocks

The domain has no outward dependencies, so its tests need none either. Build
fixtures with Object Mothers (see
[01-domain-layer.md](01-domain-layer.md)), exercise behavior, assert on
resulting state or thrown domain errors.

```ts
describe('Order', () => {
  it('cannot be modified once confirmed', () => {
    const order = OrderMother.confirmed()

    expect(() => order.addLine(OrderLineMother.random())).toThrow(
      CannotModifyConfirmedOrderError,
    )
  })
})
```

If a domain test needs a mock, that's a signal the class has an outward
dependency it shouldn't — move that dependency to application/infrastructure
instead.

## Application tests — mock the ports

Application services depend only on ports (repository contracts, external
service contracts). Tests mock those ports with **ts-mockito** and assert
both the resulting domain state and the interactions with the port.

```ts
import { instance, mock, verify, when } from 'ts-mockito'

describe('ConfirmOrderCommandHandler', () => {
  it('confirms an existing order and persists it', async () => {
    const repository = mock<OrderRepository>()
    const order = OrderMother.random()
    when(repository.findById(order.id)).thenResolve(order)

    const handler = new ConfirmOrderCommandHandler(instance(repository))
    await handler.handle(new ConfirmOrderCommand(order.id.toString()))

    expect(order.status.isConfirmed()).toBe(true)
    verify(repository.save(order)).once()
  })

  it('throws when the order does not exist', async () => {
    const repository = mock<OrderRepository>()
    when(repository.findById(anything())).thenResolve(null)

    const handler = new ConfirmOrderCommandHandler(instance(repository))

    await expect(handler.handle(new ConfirmOrderCommand('missing'))).rejects.toThrow(
      OrderNotFoundError,
    )
  })
})
```

Never mock a domain object itself (`Order`, `Money`) — domain objects are
real, cheap to construct via Object Mothers, and mocking them would hide the
very invariants the test should verify. Only ports get mocked.

## Infrastructure tests

Repository implementations and mappers are tested against something as
close to the real dependency as practical (a test container, an in-memory
DB, a recorded HTTP fixture). These tests are fewer and slower by nature —
they exist to verify the adapter honors the port contract and the mapping is
correct in both directions, not to re-verify business rules already covered
by domain tests.

## Presentation is not unit-tested

Containers and components MUST NOT have their own `.test.ts(x)` files —
no mocked-state-service container tests, no isolated-props component
tests. Presentation is covered exclusively by
[end-to-end tests](12-e2e-testing.md) driving a real browser against a
real build.

Why: a container/component test mocking the state service mostly proves
the mock was set up correctly — it doesn't touch real routing, doesn't
touch the real DI wiring, and doesn't touch what the DOM actually renders
in a browser, which is the one thing presentation code exists to do. That
coverage already exists, for real, in the E2E suite
([12-e2e-testing.md](12-e2e-testing.md)) — a second, weaker copy of it in
mocked component tests is maintenance cost (the props/markup drift, the
tests don't) without a matching increase in confidence. Domain and
application logic get the opposite treatment deliberately — see above —
because *those* mocked/no-mock unit tests verify real business rules that
E2E scenarios don't exercise exhaustively.

This doesn't relax anything about *building* presentation code correctly
— containers still only branch on state and compose components (see
[05-presentation-layer.md](05-presentation-layer.md)) — it only says
where that correctness gets verified: by a Gherkin scenario clicking
through the real app, not by a unit test rendering the component in
isolation.

## End-to-end tests — the whole system, for real

Everything above tests one layer in isolation. None of it proves routing,
rendering, and a real production build actually work together. That's a
separate suite, run against a real browser and a real build rather than
mocks — see [12-e2e-testing.md](12-e2e-testing.md) for the full
Playwright/Cucumber/Gherkin setup. It's slower by nature and deliberately
kept out of the fast `pre-push` suite (see
[10-git-workflow-husky.md](10-git-workflow-husky.md)) — run on demand and
in CI, not on every push.

## Arch tests — enforce the dependency rule in CI

Layer violations MUST fail the build, not rely on reviewers catching them.
Use a dependency-boundary tool wired into CI: `dependency-cruiser` (or
`eslint-plugin-boundaries`) configured with one rule per forbidden edge, in
a `.dependency-cruiser.cjs` at the repo root.

`shared/` follows the exact same layering as a feature module (see
[11-shared-services.md](11-shared-services.md)) — `errors/`,
`notifications/`, and any future shared concern each get their own
`domain/`/`application/`/`infrastructure/` — so the rules match both
`src/modules/<name>/<layer>` and `src/shared/<name>/<layer>`. `shared/`
also has one flat, app-wide presentation folder (`shared/presentation/` —
`Header`, `Footer`, `Layout`, cross-cutting components used by every
route) rather than one per concern, so the presentation pattern accounts
for that shape too. Test code (`__tests__/`) is excluded outright — an
integration test wiring a real repository into a query handler, or an
Object Mother crossing into a domain test folder, is expected to cross
these edges; only production code is checked.

```js
// .dependency-cruiser.cjs
const DOMAIN = '^src/(modules/[^/]+|shared/[^/]+)/domain(/|$)'
const APPLICATION = '^src/(modules/[^/]+|shared/[^/]+)/application(/|$)'
const INFRASTRUCTURE = '^src/(modules/[^/]+|shared/[^/]+)/infrastructure(/|$)'
const PRESENTATION = '^src/(modules/[^/]+/presentation|shared/presentation|shared/[^/]+/presentation)(/|$)'

module.exports = {
  forbidden: [
    {
      name: 'domain-no-outward-deps',
      severity: 'error',
      from: { path: DOMAIN },
      to: { path: `${APPLICATION}|${INFRASTRUCTURE}|${PRESENTATION}` },
    },
    {
      name: 'application-only-depends-on-domain',
      severity: 'error',
      from: { path: APPLICATION },
      to: { path: `${INFRASTRUCTURE}|${PRESENTATION}` },
    },
    {
      name: 'infrastructure-no-presentation',
      severity: 'error',
      from: { path: INFRASTRUCTURE },
      to: { path: PRESENTATION },
    },
    {
      name: 'presentation-no-infrastructure',
      severity: 'error',
      from: { path: PRESENTATION },
      to: { path: INFRASTRUCTURE },
    },
  ],
  options: {
    exclude: { path: '(^|/)__tests__/' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.app.json' },
  },
}
```

Run it as its own CI/test step (`pnpm arch-test`, which runs `depcruise
src`), and treat any violation as a build failure, exactly like a failing
unit test.

## Tests live in a co-located `__tests__` folder

Test files sit in a `__tests__/` subfolder next to the code they test, not
inline as siblings and not in one top-level test tree:

```
domain/
  entities/
    Post.ts
    __tests__/
      Post.test.ts
      PostMother.ts
application/
  query/
    ListLatestPostsQueryHandler.ts
    __tests__/
      ListLatestPostsQueryHandler.test.ts
infrastructure/
  FakePostRepository.ts
  __tests__/
    FakePostRepository.test.ts
```

Every folder that has tests gets its own `__tests__/`, co-located as close
as possible to what it verifies — `entities/__tests__/`, not a single
`domain/__tests__/` catch-all, and never a project-wide `tests/` directory
mirroring `src/`. `vitest` discovers `*.test.ts` files regardless of the
folder name, so no config change is needed to support this.

## Object Mothers, once more

Object Mothers are shared across domain and application tests (see
[above](#presentation-is-not-unit-tested) for why there's no presentation
test to share them with). They live in the `__tests__/` folder of the
entity/value object they build (e.g. `entities/__tests__/PostMother.ts`),
are imported only from tests, and are the only sanctioned way to
construct a domain fixture. It's normal for an application test to
import a domain module's Object Mother across that `__tests__/` boundary
— this rule is about test code, not the production import-boundary rule
from [02-hexagonal-architecture.md](02-hexagonal-architecture.md). Ad-hoc
literals (`{ id: '1', status: 'confirmed' }`) scattered across test files
are what Object Mothers replace — if you find yourself typing one, extract
or extend the Mother instead.
