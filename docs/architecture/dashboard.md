# Dashboard Module (`front/lib/dashboard/`)

## Purpose

The dashboard is a CMS module inside the `front` Flutter app. It lets users create, edit, and delete blog posts. It is accessible at `/dashboard` and talks to the `back/` REST API via `HttpPostRepository`.

The dashboard is currently **public** (no auth guard). Authentication will be added later as a `go_router` redirect — see [front.md](front.md) when that exists, or the router in `front/lib/router.dart`.

## Module structure

```
lib/dashboard/
  application/
    post.write_service.dart       # delegates save/delete to PostRepository port
    post_edit_state.dart          # PostEditState + PostEditStatus enum
    post_edit.state_service.dart  # Cubit — owns list + edit states
  infrastructure/
    http_post_repository.dart     # implements PostRepository; calls back-end API
  presentation/
    containers/
      post_list.container.dart    # /dashboard — list of posts with edit/delete
      post_editor.container.dart  # /dashboard/new and /dashboard/:slug/edit
    widgets/
      post_list.dart              # dumb list widget
      post_editor_form.dart       # dumb form widget
```

## Dependency injection

`HttpPostRepository` is registered as a `LazySingleton` by its concrete type (separate from the blog's `PostRepository` → `MarkdownPostRepository`). `PostEditStateService` is also a `LazySingleton` so the list and editor share state across navigation.

```dart
sl.registerLazySingleton<HttpPostRepository>(
  () => HttpPostRepository(_apiBaseUrl),
);
sl.registerLazySingleton(
  () => PostEditStateService(
    PostReadService(sl<HttpPostRepository>()),
    PostWriteService(sl<HttpPostRepository>()),
  ),
);
```

`PostReadService` from the `blog` application layer is reused with the HTTP repository. `PostWriteService` lives in `dashboard/application/`.

## Routes

| Path | Widget | Description |
|------|--------|-------------|
| `/dashboard` | `PostListContainer` | Paginated list of posts; links to new/edit |
| `/dashboard/new` | `PostEditorContainer` | Empty form; saves a new post |
| `/dashboard/:slug/edit` | `PostEditorContainer` | Pre-filled form; updates existing post |

## State flow

`PostEditStateService` is a singleton Cubit. Navigating between the list and editor shares the same instance — `startEditing(post)` on the list survives the push to the editor.

```
List loads  →  loadPage()      →  PostEditStatus.loaded  →  shows posts
New post    →  clearEditing()  →  push /dashboard/new    →  empty form
Edit post   →  startEditing()  →  push /dashboard/:slug/edit  →  pre-filled form
Save        →  savePost()      →  PostEditStatus.saved   →  go /dashboard
Delete      →  deletePost()    →  reloads list
Backend down → loadPage() catch  →  PostEditStatus.error  →  shows error message
```

## API base URL

Set at compile time via `--dart-define=API_BASE_URL=http://localhost:8080`. Default is `http://localhost:8080`. `make run` passes this automatically.

## Testing

Arch tests in `front/test/arch/dashboard_arch_test.dart` enforce:
- Application does not import infrastructure or presentation
- Presentation does not import infrastructure
- State services end with `.state_service.dart`
- Containers end with `.container.dart`
