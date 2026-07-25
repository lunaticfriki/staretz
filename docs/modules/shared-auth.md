# Shared: Auth

Email/password authentication backed by Firebase Auth, following the
same domain/application/infrastructure/presentation shape as
[shared-theme.md](shared-theme.md) — a real cross-cutting concern with
real reactive state and an external system behind it, so it gets the
full treatment rather than staying domain-only like
[shared-pagination.md](shared-pagination.md)/[shared-search.md](shared-search.md).

## Domain

```
src/shared/auth/domain/
  value-objects/
    AuthUser.valueObject.ts
    __tests__/
  repositories/
    Auth.repository.ts
```

**`AuthUser`** wraps `{ uid, email }` — no `InvalidXxxError`/validation
like `PostAuthor`/`Category` have, because a value coming back from
Firebase Auth is already trusted (it's never built from raw user input
the way frontmatter/form fields are); `create()` just assembles it,
`equals()` compares by `uid`. **`AuthRepository`** (port) is three
methods: `login(email, password)`, `logout()`, and
`onAuthStateChanged(callback)` returning an unsubscribe function —
mirrors `ThemeRepository`'s shape of "one method that changes state,
one that observes it," except here the "observe" side is a genuine
subscription (Firebase Auth's own session persistence + listener),
not a one-shot read.

## Application

`src/shared/auth/application/Auth.stateService.ts` — one signal,
`auth: Signal<AuthState>` where `AuthState` is `loading |
authenticated (AuthUser) | unauthenticated`. `initialize()` subscribes
to `AuthRepository.onAuthStateChanged()` exactly once (guarded by a
private `subscribed` flag — unlike `ThemeStateService.initialize()`,
this isn't naturally idempotent, since a second call would register a
second Firebase listener updating the same signal from two places).
`login()`/`logout()` call the repository directly and update the
signal from the result; login failures are left to throw and propagate
to the caller (`LoginPage` catches them and shows an inline message) —
same "expected, local outcome" reasoning as `usePostBySlugState`'s
not-found case in [blog.md](blog.md), not routed through
`ErrorManager`.

## Infrastructure

`src/shared/auth/infrastructure/FirebaseAuth.repository.ts` — the only
`AuthRepository` adapter, wrapping `firebase/auth`'s
`signInWithEmailAndPassword`/`signOut`/`onAuthStateChanged` and
translating Firebase's `User` into `AuthUser`. Firebase Auth handles
session persistence itself (localStorage-backed by default); this
adapter doesn't add its own.

Uses the shared Firebase App instance from
`src/shared/firebase/firebaseApp.ts` (via `src/shared/firebase/auth.ts`
→ `getAuth(firebaseApp)`) — that bootstrap file used to live inside
`modules/blog/infrastructure/` when only Firestore needed it; it moved
to `shared/firebase/` the moment a second module (this one) needed the
same app instance, per
[06-vertical-slicing.md](../06-vertical-slicing.md#rules) ("shared/ is
not a dumping ground — if something is only used by one module, it
stays in that module" — the inverse holds once a second consumer shows
up).

## Presentation

`src/shared/presentation/` (flat, same rationale as
[shared-theme.md](shared-theme.md#presentation)):

- **`useAuthState.hook.ts`** — pulls `AuthStateService` from
  `container`, calls `initialize()` on mount, returns
  `{ auth, login, logout }`.
- **`LoginPage.component.tsx`** — email/password form; on success,
  navigates to `/dashboard`; on failure, shows a generic Catalan
  message (`"Correu electrònic o contrasenya incorrectes."`) regardless
  of Firebase's specific error code, to avoid leaking
  infrastructure-shaped error details into the UI.

## DI wiring

`AuthRepository` → `AuthStateService`, both `.inSingletonScope()`.
Symbols: `AuthRepository`, `AuthStateService`.

## Setup

Firebase Auth needs the Email/Password sign-in provider enabled once,
per project, from the console (`Authentication` → `Sign-in method`) —
there's no `firebase-tools` CLI command for this, unlike Firestore/
Storage which auto-enable their APIs on first `firebase deploy`. At
least one user (email + password) needs to exist for anyone to be able
to log in; add one from `Authentication` → `Users` in the console.

## Tests

```
domain/value-objects/__tests__/    AuthUser.valueObject.test.ts
application/__tests__/             Auth.stateService.test.ts (mocked AuthRepository)
```

`FirebaseAuthRepository` has no test — same reasoning as
`FirebasePostRepository` in [blog.md](blog.md#tests): a thin sequence
of SDK calls, would need the Firebase Auth emulator to test for real.
