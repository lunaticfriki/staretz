# Dashboard Layer (Flutter web — private CMS)

## Purpose

The dashboard is a private Flutter web app that lets authenticated users create, edit, and delete blog posts. It talks to the back-end API via `HttpPostRepository` and uses Google Sign-In for authentication.

## Feature structure

```
lib/
  auth/
    domain/          # AuthUser entity, AuthRepository port
    application/     # AuthStateService (Cubit), AuthState
    infrastructure/  # GoogleAuthRepository
    presentation/    # LoginContainer, DashboardShellContainer, LoginButton
  blog/
    application/     # PostReadService, PostWriteService, PostEditStateService
    infrastructure/  # HttpPostRepository
    presentation/    # PostListContainer, PostEditorContainer, widgets
  di/
    container.dart
  main.dart
  router.dart
```

## Auth flow

1. App starts → `AuthStateService.checkCurrentUser()` fires.
2. If no current user → `GoRouter` redirects to `/login`.
3. `LoginContainer` shows the "Sign in with Google" button.
4. On success → `AuthStateService` emits `authenticated` → router redirects to `/posts`.
5. `DashboardShellContainer` wraps all protected routes and listens for `unauthenticated` to redirect back to `/login`.

## Blog management

`PostEditStateService` owns the list + edit states. It calls `PostReadService` for reads and `PostWriteService` for mutations, which delegate to `HttpPostRepository`. The HTTP repository speaks to the `back/` API.

## Naming conventions

Same rules as `front/` — see [naming.md](naming.md). Additional convention for the dashboard edit state:

| Artefact | Suffix | Example |
|----------|--------|---------|
| Edit state service | `<entity>_edit.state_service.dart` | `post_edit.state_service.dart` |
| Edit state class | `<entity>_edit_state.dart` | `post_edit_state.dart` |

## Testing

Architecture tests in `test/arch/dashboard_arch_test.dart` enforce layer boundaries and naming conventions across both `auth` and `blog` features. Run with `flutter test` from `dashboard/`.
