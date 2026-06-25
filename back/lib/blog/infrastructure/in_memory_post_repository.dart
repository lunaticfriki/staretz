import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_body.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_id.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_title.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz_domain/shared/pagination/paginated.dart';

class InMemoryPostRepository implements PostRepository {
  final List<Post> _posts = List.of(_seeds);

  @override
  Future<List<Post>> findPreview(int limit) async {
    final sorted = _sorted();
    return sorted.take(limit).toList();
  }

  @override
  Future<Paginated<Post>> findPage(PageCriteria criteria) async {
    final sorted = _sorted();
    final items =
        sorted.skip(criteria.offset).take(criteria.pageSize).toList();
    return Paginated(
      items: items,
      totalCount: sorted.length,
      criteria: criteria,
    );
  }

  @override
  Future<Post?> findBySlug(PostSlug slug) async {
    try {
      return _posts.firstWhere((p) => p.slug.value == slug.value);
    } on StateError {
      return null;
    }
  }

  @override
  Future<void> save(Post post) async {
    final idx = _posts.indexWhere((p) => p.id.value == post.id.value);
    if (idx == -1) {
      _posts.add(post);
    } else {
      _posts[idx] = post;
    }
  }

  @override
  Future<void> delete(PostSlug slug) async {
    _posts.removeWhere((p) => p.slug.value == slug.value);
  }

  List<Post> _sorted() => [..._posts]
    ..sort((a, b) => b.publishedAt.value.compareTo(a.publishedAt.value));
}

final _seeds = [
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000001'),
    title: PostTitle.create('Hexagonal Architecture in Dart'),
    slug: PostSlug.create('hexagonal-architecture-dart'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/hexagonal/800/600'),
    excerpt: PostExcerpt.create(
      'Ports and adapters keep your domain logic independent of frameworks, '
      'databases, and HTTP. Here is how we apply it in a Dart monorepo.',
    ),
    body: PostBody.create(
      '## Why hexagonal?\n\n'
      'When your domain logic lives behind a port (an abstract interface), '
      'you can swap adapters without touching the core. '
      'Need to switch from PostgreSQL to an in-memory store for tests? '
      'Write a new adapter, register it in your DI container, done.\n\n'
      '## Ports live in the domain\n\n'
      'The `PostRepository` interface is declared in `packages/domain`. '
      'Both the front-end (`HttpPostRepository`) and the back-end '
      '(`PostgresPostRepository`, `InMemoryPostRepository`) implement it. '
      'The domain knows nothing about either.\n\n'
      '## The dependency rule\n\n'
      'Domain → nothing. Application → domain. Infrastructure → application + domain. '
      'Presentation → application + domain. Never the other way around.\n\n'
      'Architecture tests in `test/arch/` enforce this mechanically — '
      'no import from application into domain, no import from presentation into infrastructure.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2026, 3, 10)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000002'),
    title: PostTitle.create('DDD Entities and Value Objects in Flutter'),
    slug: PostSlug.create('ddd-entities-value-objects-flutter'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/ddd/800/600'),
    excerpt: PostExcerpt.create(
      'Domain-driven design is not just for back-ends. '
      'Modelling your Flutter app with entities and value objects '
      'makes state management cleaner and bugs rarer.',
    ),
    body: PostBody.create(
      '## Entities vs value objects\n\n'
      'An **entity** has an identity that survives mutation — a `Post` is still '
      'the same post when you change its title, because its `PostId` stays the same.\n\n'
      'A **value object** is defined by its content. Two `PostSlug` instances '
      'with the same string are equal. Value objects are immutable and '
      'validate themselves on construction.\n\n'
      '## Throwing at the boundary\n\n'
      '```dart\n'
      'class PostSlug {\n'
      '  final String value;\n'
      '  PostSlug.create(String raw) : value = raw {\n'
      '    if (raw.isEmpty) throw ArgumentError("slug cannot be empty");\n'
      '  }\n'
      '}\n'
      '```\n\n'
      'The value object throws on invalid input, so the rest of the app '
      'can trust that any `PostSlug` it holds is valid.\n\n'
      '## Shared via the domain package\n\n'
      'In this monorepo, `staretz_domain` is a pure Dart package imported by '
      'both the Flutter front-end and the Dart Frog back-end. '
      'One definition, no duplication.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2026, 4, 5)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000003'),
    title: PostTitle.create('Dart Frog: a Minimal API Server'),
    slug: PostSlug.create('dart-frog-minimal-api-server'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/dartfrog/800/600'),
    excerpt: PostExcerpt.create(
      'Dart Frog turns a `routes/` folder into an HTTP API with zero boilerplate. '
      'It pairs well with hexagonal architecture because the route handlers '
      'replace the presentation layer.',
    ),
    body: PostBody.create(
      '## File-based routing\n\n'
      'Each file under `routes/` becomes an endpoint. '
      '`routes/posts/index.dart` handles `/posts`, '
      '`routes/posts/[slug].dart` handles `/posts/:slug`. '
      'Dynamic segments become handler parameters automatically.\n\n'
      '## Middleware and DI\n\n'
      'Dart Frog middleware uses `provider<T>()` to inject services into the '
      'request context. Route handlers read them with `context.read<T>()`. '
      'This maps cleanly to hexagonal architecture: the middleware builds '
      'the infrastructure, the routes call the application layer.\n\n'
      '## No framework lock-in\n\n'
      'The application and domain layers import nothing from `dart_frog`. '
      'If we ever switch to Shelf or another server framework, '
      'only the route files change.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2026, 4, 22)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000004'),
    title: PostTitle.create('Dart Monorepos: One Repo, Three Packages'),
    slug: PostSlug.create('dart-monorepos-one-repo-three-packages'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/monorepo/800/600'),
    excerpt: PostExcerpt.create(
      'Sharing domain code between a Flutter front-end and a Dart Frog back-end '
      'without duplicating models or validation logic — that is what a Dart monorepo buys you.',
    ),
    body: PostBody.create(
      '## The structure\n\n'
      '```\n'
      'staretz/\n'
      '  packages/domain/   # pure Dart, shared by everyone\n'
      '  front/             # Flutter web\n'
      '  back/              # Dart Frog REST API\n'
      '```\n\n'
      '## Path dependencies\n\n'
      'Each app adds the domain package as a path dependency in its `pubspec.yaml`:\n\n'
      '```yaml\n'
      'dependencies:\n'
      '  staretz_domain:\n'
      '    path: ../packages/domain\n'
      '```\n\n'
      'No publishing required. Changes to the domain are picked up immediately.\n\n'
      '## Enforcing the boundary\n\n'
      'The domain package has no Flutter dependency — the arch test checks every '
      'import in `packages/domain/lib/` and fails if it finds `flutter`. '
      'This keeps the domain usable by the Dart-only back-end.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2026, 5, 15)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000005'),
    title: PostTitle.create('Architecture Tests: Keeping the Layers Honest'),
    slug: PostSlug.create('architecture-tests-keeping-layers-honest'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/archtests/800/600'),
    excerpt: PostExcerpt.create(
      'You can document layer rules all you want, but without automated checks '
      'someone will violate them by accident. A few dozen lines of Dart '
      'make the rules executable.',
    ),
    body: PostBody.create(
      '## The idea\n\n'
      'An architecture test reads the source files in a given layer directory, '
      'extracts the import lines, and asserts that none of them point to a '
      'forbidden layer. No special framework needed — just `dart:io` and '
      '`package:test`.\n\n'
      '## Example\n\n'
      '```dart\n'
      "test('application does not import infrastructure', () {\n"
      "  for (final file in findDartFiles('lib/blog/application')) {\n"
      '    final imports = readImports(file);\n'
      "    expect(imports, everyElement(isNot(contains('/infrastructure/'))));\n"
      '  }\n'
      '});\n'
      '```\n\n'
      '## Naming conventions\n\n'
      'The same file-scan approach enforces naming: state services must end in '
      '`.state_service.dart`, containers in `.container.dart`, and so on. '
      'Rename a file wrong and a test fails immediately.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2026, 6, 1)),
  ),
];
