# Shared: Policies

A tiny, generic authorization primitive — named policies, each a rule
that evaluates to allow/deny against the current app state, checked
through one method: `PolicyService.can(name, context)`. This is what
gates the dashboard module behind login; any future "X requires Y"
rule (a role, a feature flag) plugs into the same registry without
touching the modules that call `can()`.

## Domain

```
src/shared/policies/domain/
  Policy.ts
  value-objects/
    PolicyName.valueObject.ts
    PolicyContext.valueObject.ts
    __tests__/
  policies/
    RequireAuthentication.policy.ts
    __tests__/
```

**`Policy`** (abstract class, sits directly under `domain/` the way
`Domain.error.ts` does in [shared-errors.md](shared-errors.md) — it's
the category itself, not one more concept needing its own subfolder):
one method, `isSatisfiedBy(context: PolicyContext): boolean`.
**`PolicyName`** is a plain non-empty-string wrapper (same shape as
`Category`/`PostAuthor`) — `'dashboard:access'` today.
**`PolicyContext`** carries whatever a policy needs to evaluate; today
that's just `{ isAuthenticated: boolean }`, deliberately minimal rather
than importing `AuthUser` itself — policies depend on domain-level
booleans/facts, not on the shape of the auth module's data.

**`RequireAuthenticationPolicy`** (`domain/policies/`, kind suffix
`.policy.ts`) is the one concrete policy so far:
`isSatisfiedBy(context)` is just `context.isAuthenticated`. Future
policies (e.g. a role check) live alongside it as their own files, each
registered under its own `PolicyName` — see [DI wiring](#di-wiring).

## Application

`src/shared/policies/application/Policy.service.ts` — zero library
dependencies, holds a `Map<string, Policy>` built at the composition
root (not by the service itself; see below) and exposes the one method
this module exists for:

```ts
abstract class PolicyService {
  abstract can(name: PolicyName, context: PolicyContext): boolean
}
```

`can()` looks up the policy by name and delegates to
`isSatisfiedBy()`; an **unregistered policy name denies by default**
(fails closed) rather than throwing or allowing — a typo in a policy
name should never silently grant access. `PolicyService` never reaches
into `AuthStateService`'s signal itself (that would pull a
`@preact/signals-core` dependency into a service that has zero library
dependencies otherwise); the caller builds `PolicyContext` from
whatever current state it already has, keeping `can()` a pure,
trivially-testable function.

## Presentation

`src/shared/presentation/`:

- **`usePolicy.hook.ts`** — the ergonomic, single-argument
  `usePolicy(name)` entry point most call sites want: composes
  `useAuthState()` (see [shared-auth.md](shared-auth.md)) into a
  `PolicyContext` and calls `PolicyService.can()`, so components never
  build the context by hand.
- **`RequirePolicy.component.tsx`** — the actual route guard: takes a
  `policy` and a `component` prop, renders `<Component />` when
  `usePolicy(policy)` is true, otherwise redirects to `/login` via
  `route('/login', true)` (once auth has finished loading — it
  deliberately renders nothing while `auth.status === 'loading'` rather
  than redirecting prematurely on first paint, which would bounce an
  already-logged-in user to `/login` for a frame before Firebase Auth's
  persisted session resolves).

This is how a module "blocks" a route: register the module's own
`PolicyName` constant (see `modules/dashboard/dashboardPolicy.ts`) and
wrap its route in `app.tsx`:

```tsx
<RequirePolicy path="/dashboard" policy={DASHBOARD_ACCESS_POLICY} component={DashboardContainer} />
```

No change to `shared/policies/` itself is needed to protect a new
route — only a new `PolicyName` constant in the module being
protected, and one line registering it in `composition-root.ts`.

## DI wiring

`PolicyService` is bound with its policy map assembled inline in
`composition-root.ts`:

```ts
container.bind<PolicyService>(TYPES.PolicyService).toDynamicValue(() => {
  const policies = new Map<string, Policy>([
    [DASHBOARD_ACCESS_POLICY.toString(), new RequireAuthenticationPolicy()],
  ])
  return new PolicyServiceImpl(policies)
})
```

This is the one place `shared/policies` (generic) and
`modules/dashboard` (the specific policy name) meet — deliberately kept
out of both modules' own code, the same way `composition-root.ts` is
the one file allowed to import both infrastructure and application/
domain together everywhere else in this app. Symbol: `PolicyService`.

## Tests

```
domain/value-objects/__tests__/    PolicyName.valueObject.test.ts
domain/policies/__tests__/         RequireAuthentication.policy.test.ts
application/__tests__/             Policy.service.test.ts
```

All pure, no mocks needed — `PolicyContext`/`Policy` are plain
synchronous logic.
