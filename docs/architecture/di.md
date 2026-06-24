# Dependency Injection

## get_it

All dependencies are registered in `lib/di/container.dart`. Each feature module has its own registration function, merged in the root container.

```dart
void setupDi() {
  _registerShared();
  _registerBlog();
}

void _registerBlog() {
  final sl = GetIt.instance;

  sl.registerLazySingleton<PostRepository>(
    () => MarkdownPostRepository(sl()),
  );
  sl.registerLazySingleton(() => PostReadService(sl()));
  sl.registerLazySingleton(() => PostWriteService(sl()));
  sl.registerFactory(() => PostStateService(sl()));
}
```

## Contracts

Every port is an abstract class in the domain. `get_it` is always registered against the abstract type, never the concrete implementation.

```dart
abstract class PostRepository {
  Future<List<Post>> findAll();
  Future<Post?> findBySlug(PostSlug slug);
}
```

Registration: `sl.registerLazySingleton<PostRepository>(() => MarkdownPostRepository(...))`.

## Cubits in the widget tree

Cubits (state services) are provided via `BlocProvider` at the container level, using `get_it` to create them:

```dart
BlocProvider(
  create: (_) => GetIt.instance<PostStateService>()..loadAll(),
  child: const PostListContainer(),
)
```

## Rules

- `main.dart` calls `setupDi()` before `runApp`.
- Only Infrastructure registers concrete adapters.
- Abstract classes (ports) are the registered type — callers never see the implementation.
- Cubits are registered as `registerFactory` so each `BlocProvider` gets a fresh instance.
