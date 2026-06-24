# Application Layer

## Pattern: CQRS without use cases

The application layer is split into three service types. There are no use case classes.

| Service type | File suffix | Responsibility |
|-------------|-------------|----------------|
| Read service | `.read-service.dart` | Query — fetches data, no side effects |
| Write service | `.write-service.dart` | Command — mutates state, returns void or domain result |
| State service | `.state-service.dart` | Cubit — owns reactive state, calls read/write services |

## Read service

Receives a repository port via constructor injection. Returns domain objects.

```dart
class PostReadService {
  final PostRepository _repository;

  PostReadService(this._repository);

  Future<List<Post>> getAllPosts() => _repository.findAll();

  Future<Post?> getPostBySlug(PostSlug slug) => _repository.findBySlug(slug);
}
```

## Write service

Same injection pattern. Performs mutations.

```dart
class PostWriteService {
  final PostRepository _repository;

  PostWriteService(this._repository);

  Future<void> publishPost(Post post) => _repository.save(post);
}
```

## State service (Cubit)

The Cubit is the state service. It owns the reactive state exposed to presentation. It calls read and write services, never the repository directly.

```dart
class PostStateService extends Cubit<PostState> {
  final PostReadService _read;

  PostStateService(this._read) : super(PostState.initial());

  Future<void> loadAll() async {
    emit(state.copyWith(status: PostStatus.loading));
    final posts = await _read.getAllPosts();
    emit(state.copyWith(status: PostStatus.loaded, posts: posts));
  }
}
```

## State classes

Each feature has a dedicated state class — a plain Dart class with `copyWith`.

```dart
class PostState {
  final PostStatus status;
  final List<Post> posts;

  const PostState({required this.status, required this.posts});

  factory PostState.initial() =>
      const PostState(status: PostStatus.initial, posts: []);

  PostState copyWith({PostStatus? status, List<Post>? posts}) => PostState(
        status: status ?? this.status,
        posts: posts ?? this.posts,
      );
}
```

## Rules

- Application services import only Domain.
- State services (Cubits) may import other application services but not Infrastructure.
- No Flutter widgets imported here.
