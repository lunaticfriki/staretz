# Domain Layer

## Folder structure

The domain layer is split into three subfolders:

```
domain/
  entities/       # identity-bearing types (Post, User, …)
  value_objects/  # structural-equality types (PostTitle, PostSlug, …)
  ports/          # repository abstract classes (PostRepository, …)
```

## Rules

- No Flutter imports. No `get_it`. No Bloc. No infrastructure concerns.
- No primitive types leak across entity boundaries — wrap every primitive in a value object.
- All constructors are private. Creation goes through factory methods.

## Entities

An entity has identity. Its constructor is private; all creation goes through named factories.

```dart
class Post {
  final PostId id;
  final PostTitle title;
  final PostSlug slug;
  final PostExcerpt excerpt;
  final PostBody body;
  final PostPublishedAt publishedAt;

  Post._({
    required this.id,
    required this.title,
    required this.slug,
    required this.excerpt,
    required this.body,
    required this.publishedAt,
  });

  factory Post.create({
    required PostId id,
    required PostTitle title,
    required PostSlug slug,
    required PostExcerpt excerpt,
    required PostBody body,
    required PostPublishedAt publishedAt,
  }) {
    return Post._(
      id: id, title: title, slug: slug,
      excerpt: excerpt, body: body, publishedAt: publishedAt,
    );
  }

  factory Post.empty() => Post._(
    id: PostId.empty(),
    title: PostTitle.empty(),
    slug: PostSlug.empty(),
    excerpt: PostExcerpt.empty(),
    body: PostBody.empty(),
    publishedAt: PostPublishedAt.empty(),
  );
}
```

## Value objects

A value object has no identity — equality is structural. It validates its own invariants in `create` and exposes a typed `value` getter.

```dart
class PostTitle {
  final String value;

  PostTitle._({required this.value});

  factory PostTitle.create(String raw) {
    if (raw.trim().isEmpty) throw InvalidPostTitleException();
    return PostTitle._(value: raw.trim());
  }

  factory PostTitle.empty() => PostTitle._(value: '');

  @override
  bool operator ==(Object other) => other is PostTitle && other.value == value;

  @override
  int get hashCode => value.hashCode;
}
```

## Ports (repository contracts)

A port is an abstract class in the domain. Infrastructure provides the implementation.

```dart
abstract class PostRepository {
  Future<List<Post>> findAll();
  Future<Post?> findBySlug(PostSlug slug);
}
```

## What belongs here

- Entities
- Value objects
- Domain exceptions
- Repository abstract classes (ports)
- Domain events (if needed)

## What does NOT belong here

- Flutter widgets
- Bloc / Cubit
- `get_it` references
- HTTP clients, file I/O, JSON parsing
