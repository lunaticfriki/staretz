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
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000006'),
    title: PostTitle.create('State Management Without a Framework'),
    slug: PostSlug.create('state-management-without-framework'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/statemgmt/800/600'),
    excerpt: PostExcerpt.create(
      'BLoC is fine, Riverpod is fine — but sometimes a plain Dart class '
      'with a stream controller is all you need. Here is when to reach for each.',
    ),
    body: PostBody.create(
      '## The trap of over-engineering\n\n'
      'New Flutter projects often start by adding a state management package before '
      'writing a single widget. The package becomes load-bearing before the problem '
      'it solves is even understood.\n\n'
      '## Start with ChangeNotifier\n\n'
      'For a small feature, a `ChangeNotifier` subclass with `notifyListeners()` '
      'is enough. It is part of Flutter, requires no dependencies, and the mental '
      'model is trivial.\n\n'
      '## Graduate to streams when needed\n\n'
      'When multiple widgets need to react to the same event independently, '
      'a `StreamController.broadcast()` pairs cleanly with `StreamBuilder`. '
      'No package, no code generation.\n\n'
      '## Reach for BLoC when events matter\n\n'
      'If you need a history of what happened — for logging, testing, or replay — '
      'explicit event classes pay off. At that point the full BLoC pattern earns '
      'its weight.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2026, 2, 14)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000007'),
    title: PostTitle.create('Testing Flutter Widgets in Isolation'),
    slug: PostSlug.create('testing-flutter-widgets-isolation'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/widgettest/800/600'),
    excerpt: PostExcerpt.create(
      'Widget tests catch layout regressions before they reach production. '
      'They run in milliseconds and need no device. Here is how to write them well.',
    ),
    body: PostBody.create(
      '## What a widget test covers\n\n'
      'A widget test pumps a widget tree into a fake canvas, lets you interact with '
      'it programmatically, and asserts on what is rendered or what callbacks fired. '
      'No emulator, no real network.\n\n'
      '## Keep tests small\n\n'
      'Test one widget per file. If the widget depends on a BLoC, provide a fake '
      'one. If it depends on a repository, mock it. The smaller the tree, '
      'the faster the test and the clearer the failure message.\n\n'
      '## Golden tests for visual regression\n\n'
      'Call `matchesGoldenFile()` to snapshot the rendered widget. '
      'The next run diffs pixels. Update goldens deliberately — '
      'a changed golden is a visual changelog.\n\n'
      '## When to use integration tests instead\n\n'
      'Widget tests cannot test real HTTP calls or platform channels. '
      'For those, use integration tests with a test driver. '
      'Keep them few; they are slow.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2026, 1, 28)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000008'),
    title: PostTitle.create('Pagination Without Boilerplate'),
    slug: PostSlug.create('pagination-without-boilerplate'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/pagination/800/600'),
    excerpt: PostExcerpt.create(
      'A single `Paginated<T>` value object and a `PageCriteria` record cover '
      'every list endpoint in the app. Less code, more consistency.',
    ),
    body: PostBody.create(
      '## The problem with ad-hoc pagination\n\n'
      'When every list endpoint invents its own page/offset/total fields, '
      'the front-end has to decode a slightly different shape every time. '
      'Bugs hide in those differences.\n\n'
      '## A shared domain type\n\n'
      '```dart\n'
      'class Paginated<T> {\n'
      '  final List<T> items;\n'
      '  final int totalCount;\n'
      '  final PageCriteria criteria;\n'
      '}\n'
      '```\n\n'
      'Both the repository port and the JSON response use this shape. '
      'The front-end deserialises into the same type.\n\n'
      '## PageCriteria carries the intent\n\n'
      '`PageCriteria` holds `page` and `pageSize`, and exposes an `offset` getter. '
      'The repository never calculates offset — it reads it from criteria. '
      'The controller never calculates total pages — it reads from `Paginated`.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2026, 1, 10)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000009'),
    title: PostTitle.create('Markdown Rendering in Flutter'),
    slug: PostSlug.create('markdown-rendering-flutter'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/markdown/800/600'),
    excerpt: PostExcerpt.create(
      'Blog posts live as Markdown in the assets folder and get rendered at runtime. '
      'No build step, no CMS dependency for read-only content.',
    ),
    body: PostBody.create(
      '## Storing content as assets\n\n'
      'Markdown files go in `assets/posts/`. Flutter bundles them at build time. '
      '`rootBundle.loadString()` reads them at runtime. '
      'No database needed for static content.\n\n'
      '## Rendering with flutter_markdown\n\n'
      '`flutter_markdown` turns a Markdown string into a widget tree. '
      'You can override the style for every element — headings, code blocks, '
      'blockquotes — by providing a `MarkdownStyleSheet`.\n\n'
      '## Syntax highlighting\n\n'
      'Pair `flutter_markdown` with `flutter_highlight` to get coloured code blocks. '
      'The highlight package ships dozens of themes. Pick one, pass it to '
      '`MarkdownStyleSheet.fromTheme()`, done.\n\n'
      '## When to use a CMS instead\n\n'
      'Asset-based Markdown requires a build and deploy to publish. '
      'If posts change frequently, a back-end API is worth the extra setup.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 12, 20)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000010'),
    title: PostTitle.create('Go Router: Typed Routes in Flutter'),
    slug: PostSlug.create('go-router-typed-routes-flutter'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/gorouter/800/600'),
    excerpt: PostExcerpt.create(
      'String-based navigation is fragile. GoRouter\'s typed route extensions '
      'let the compiler catch broken links before the user does.',
    ),
    body: PostBody.create(
      '## The string problem\n\n'
      '`context.go(\'/posts/\$slug\')` works until someone renames the route. '
      'The compiler does not complain. The user gets a 404.\n\n'
      '## Typed routes\n\n'
      'With code generation, each route becomes a class:\n\n'
      '```dart\n'
      '@TypedGoRoute<PostRoute>(path: \'/posts/:slug\')\n'
      'class PostRoute extends GoRouteData {\n'
      '  final String slug;\n'
      '  const PostRoute({required this.slug});\n'
      '}\n'
      '```\n\n'
      'Navigate with `PostRoute(slug: post.slug).go(context)`. '
      'Rename the class and the compiler shows every call site.\n\n'
      '## Nested shells\n\n'
      'GoRouter\'s `ShellRoute` keeps a persistent shell widget (header, nav bar) '
      'while swapping the body. The shell is not rebuilt on navigation — '
      'only the body subtree changes.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 12, 5)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000011'),
    title: PostTitle.create('Responsive Layouts with LayoutBuilder'),
    slug: PostSlug.create('responsive-layouts-layoutbuilder'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/responsive/800/600'),
    excerpt: PostExcerpt.create(
      '`LayoutBuilder` gives you the parent constraints at build time. '
      'That is all you need to switch between mobile and desktop layouts '
      'without platform detection.',
    ),
    body: PostBody.create(
      '## Why not MediaQuery alone\n\n'
      '`MediaQuery.sizeOf(context).width` gives you the screen width, '
      'not the widget width. Inside a side panel or a dialog, '
      'the screen width is meaningless — the available width is what matters.\n\n'
      '## LayoutBuilder to the rescue\n\n'
      '```dart\n'
      'LayoutBuilder(\n'
      '  builder: (context, constraints) {\n'
      '    if (constraints.maxWidth < 640) return MobileLayout();\n'
      '    return DesktopLayout();\n'
      '  },\n'
      ')\n'
      '```\n\n'
      'The breakpoint is relative to the widget, not the screen.\n\n'
      '## Keep breakpoints as constants\n\n'
      'Scatter magic numbers like `640` across files and you will spend an hour '
      'hunting them when the design changes. One `const _mobileBreakpoint = 640.0` '
      'per file that needs it — or a shared constants file if many files share it.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 11, 18)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000012'),
    title: PostTitle.create('JSON Serialisation Without Code Generation'),
    slug: PostSlug.create('json-serialisation-without-code-generation'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/jsonserial/800/600'),
    excerpt: PostExcerpt.create(
      'Code generation is powerful but adds a build step and generated files to '
      'every PR. For small projects, hand-written `fromJson` and `toJson` are faster.',
    ),
    body: PostBody.create(
      '## The trade-off\n\n'
      '`json_serializable` generates correct, fast code. '
      'But every model change requires re-running `dart run build_runner build`. '
      'Forgetting that step is a common source of hard-to-diagnose bugs.\n\n'
      '## Hand-written factories\n\n'
      '```dart\n'
      'factory Post.fromJson(Map<String, dynamic> json) => Post.create(\n'
      '  id: PostId.create(json[\'id\'] as String),\n'
      '  title: PostTitle.create(json[\'title\'] as String),\n'
      '  // ...\n'
      ');\n'
      '```\n\n'
      'The value object constructors validate on the way in. '
      'No annotation needed.\n\n'
      '## When to switch to generation\n\n'
      'Once you have more than ten models, the repetition of hand-written '
      'serialisation becomes error-prone. That is the right time to add '
      '`json_serializable` and commit the generated files.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 11, 2)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000013'),
    title: PostTitle.create('Error Handling as a Domain Concept'),
    slug: PostSlug.create('error-handling-domain-concept'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/errordomain/800/600'),
    excerpt: PostExcerpt.create(
      'Throwing exceptions across layer boundaries leaks infrastructure details '
      'into your domain. A sealed `Result` type keeps failures explicit and typed.',
    ),
    body: PostBody.create(
      '## Exceptions cross boundaries invisibly\n\n'
      'When a repository throws `PostgresException` and the UI catches it, '
      'the UI now knows about Postgres. That is a dependency the architecture '
      'diagrams do not show.\n\n'
      '## Sealed Result type\n\n'
      '```dart\n'
      'sealed class Result<T> {}\n'
      'class Ok<T> extends Result<T> { final T value; Ok(this.value); }\n'
      'class Err<T> extends Result<T> { final String message; Err(this.message); }\n'
      '```\n\n'
      'The application layer catches infrastructure exceptions and returns `Err`. '
      'The UI pattern-matches on `Ok`/`Err`. No exception type leaks upward.\n\n'
      '## Pattern matching in Dart 3\n\n'
      '```dart\n'
      'switch (result) {\n'
      '  case Ok(:final value): showPost(value);\n'
      '  case Err(:final message): showError(message);\n'
      '}\n'
      '```\n\n'
      'The exhaustiveness check ensures you handle both cases.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 10, 15)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000014'),
    title: PostTitle.create('Dark Mode Without setState'),
    slug: PostSlug.create('dark-mode-without-setstate'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/darkmode/800/600'),
    excerpt: PostExcerpt.create(
      'Toggling the app theme at the root with setState re-builds the entire tree. '
      'A BLoC or ChangeNotifier at the top limits rebuilds to widgets that care.',
    ),
    body: PostBody.create(
      '## The naive approach\n\n'
      'Storing `themeMode` in the root `StatefulWidget` and calling `setState` '
      'works but rebuilds every widget in the app on toggle. '
      'On a large tree that is noticeable.\n\n'
      '## BLoC at the root\n\n'
      'Wrap `MaterialApp` in a `BlocBuilder<ThemeStateService, ThemeState>`. '
      'Only the `MaterialApp` rebuilds when the theme changes. '
      'Widgets deeper in the tree rebuild only if their own subtree changes.\n\n'
      '## Persisting the preference\n\n'
      'Write the selected theme to `SharedPreferences` in the BLoC\'s event handler. '
      'Read it back in the BLoC\'s constructor. '
      'The user\'s preference survives restarts without any UI code changes.\n\n'
      '## System theme\n\n'
      'Offer a third option: follow the system. '
      '`ThemeMode.system` lets `MaterialApp` read `MediaQuery.platformBrightnessOf`.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 10, 1)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000015'),
    title: PostTitle.create('Dart Records and Patterns in Practice'),
    slug: PostSlug.create('dart-records-patterns-practice'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/dartrecords/800/600'),
    excerpt: PostExcerpt.create(
      'Dart 3 records are anonymous, immutable tuples with named fields. '
      'Paired with pattern matching, they eliminate many one-off data classes.',
    ),
    body: PostBody.create(
      '## Records for multiple return values\n\n'
      'Before records, returning two values meant a `Map`, a custom class, '
      'or an out-parameter. Now:\n\n'
      '```dart\n'
      '(String name, int age) parse(String input) {\n'
      '  // ...\n'
      '  return (name, age);\n'
      '}\n'
      'final (name, age) = parse(raw);\n'
      '```\n\n'
      '## Destructuring in switch\n\n'
      '```dart\n'
      'switch (point) {\n'
      '  case (0, 0): print("origin");\n'
      '  case (final x, 0): print("x-axis at \$x");\n'
      '  case (0, final y): print("y-axis at \$y");\n'
      '  case (final x, final y): print("(\$x, \$y)");\n'
      '}\n'
      '```\n\n'
      '## When to prefer a class\n\n'
      'Records have no methods and no named constructors. '
      'If the data needs validation or behaviour, a value object class is still better.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 9, 12)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000016'),
    title: PostTitle.create('Writing a REST Client in Pure Dart'),
    slug: PostSlug.create('rest-client-pure-dart'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/restclient/800/600'),
    excerpt: PostExcerpt.create(
      '`http` plus a thin adapter class is all you need. '
      'No Dio, no Retrofit, no code generation — just typed methods and error mapping.',
    ),
    body: PostBody.create(
      '## The adapter pattern\n\n'
      'The domain declares a `PostRepository` port. '
      'The front-end has an `HttpPostRepository` adapter that calls the REST API. '
      'The adapter is the only place that knows about HTTP status codes.\n\n'
      '## Mapping errors at the boundary\n\n'
      'A 404 from the server becomes `null` (post not found). '
      'A 5xx becomes an `Err` result. '
      'The application layer never sees `http.Response`.\n\n'
      '## Parsing at the boundary\n\n'
      '`jsonDecode` and `Post.fromJson` run in the adapter. '
      'Above the adapter, every value is already a typed domain object. '
      'If parsing fails, the adapter catches the exception and returns `Err`.\n\n'
      '## Testing the adapter\n\n'
      'Swap the real `http.Client` with a `MockClient` from the `http` package. '
      'Feed it canned responses. No real server needed.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 8, 28)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000017'),
    title: PostTitle.create('Immutability in Dart: Freeze vs Manual'),
    slug: PostSlug.create('immutability-dart-freeze-vs-manual'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/immutable/800/600'),
    excerpt: PostExcerpt.create(
      '`freezed` generates copyWith, equality, and pattern matching for free. '
      'Hand-written classes give you full control and zero generated files. '
      'Neither is always right.',
    ),
    body: PostBody.create(
      '## What freezed gives you\n\n'
      'A single `@freezed` annotation generates: a `copyWith` method, '
      'structural equality via `==` and `hashCode`, `toString`, '
      'and union type support with pattern matching. '
      'For data-heavy apps this is a significant time saving.\n\n'
      '## What freezed costs\n\n'
      'A build step. Generated `.freezed.dart` files in every PR. '
      'A plugin that must stay in sync with the Dart version.\n\n'
      '## Hand-written value objects\n\n'
      'For the domain layer, where each class also validates on construction, '
      'hand-written classes are often clearer. '
      'The validation logic sits next to the field definition. '
      'No annotation magic required.\n\n'
      '## A pragmatic split\n\n'
      'Use `freezed` for UI state classes where there are many fields and no '
      'validation. Use manual classes for domain value objects. '
      'Keep the two worlds separate.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 8, 10)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000018'),
    title: PostTitle.create('Dependency Injection Without a Container'),
    slug: PostSlug.create('dependency-injection-without-container'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/dicontainer/800/600'),
    excerpt: PostExcerpt.create(
      'Most Dart apps do not need get_it or a full DI framework. '
      'Constructor injection and Dart Frog\'s `provider` middleware cover nearly every case.',
    ),
    body: PostBody.create(
      '## Constructor injection is DI\n\n'
      'Passing dependencies through constructors is dependency injection. '
      'No framework required. The object cannot exist without its dependencies, '
      'so there is no null-check at the use site.\n\n'
      '## Dart Frog provider middleware\n\n'
      'On the server, `provider<PostRepository>(() => InMemoryPostRepository())` '
      'in middleware makes the repository available to all routes under that path. '
      'Routes read it with `context.read<PostRepository>()`.\n\n'
      '## When to add a container\n\n'
      'Once your dependency graph has cycles, conditional registrations, '
      'or lazy singletons, manual wiring becomes error-prone. '
      'That is the moment to reach for `get_it` or similar.\n\n'
      '## Test benefit\n\n'
      'Constructor-injected dependencies are trivial to swap in tests. '
      'Pass a fake. No mocking framework needed.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 7, 22)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000019'),
    title: PostTitle.create('Custom Lint Rules for Architecture Enforcement'),
    slug: PostSlug.create('custom-lint-rules-architecture'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/customlint/800/600'),
    excerpt: PostExcerpt.create(
      'Architecture tests catch violations at test time. '
      'Custom lint rules catch them at save time, in the IDE, before a build even runs.',
    ),
    body: PostBody.create(
      '## custom_lint and analyzer_plugin\n\n'
      'Dart\'s `custom_lint` package lets you write lint rules in Dart. '
      'The rule runs inside the analyzer, so violations appear as squiggles '
      'in VS Code or IntelliJ immediately.\n\n'
      '## Example: no infrastructure imports in domain\n\n'
      '```dart\n'
      'class NoDomainToInfrastructure extends DartLintRule {\n'
      '  @override\n'
      '  void run(resolver, reporter, cancellationToken) {\n'
      '    // check import URIs against layer paths\n'
      '  }\n'
      '}\n'
      '```\n\n'
      '## Trade-offs\n\n'
      'Custom lint rules are harder to write than architecture tests '
      'because they work with the AST rather than file paths. '
      'Start with architecture tests; add lint rules when you want IDE feedback.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 7, 5)),
  ),
  Post.create(
    id: PostId.create('11111111-0000-0000-0000-000000000020'),
    title: PostTitle.create('Deploying Flutter Web with a Dart Frog API'),
    slug: PostSlug.create('deploying-flutter-web-dart-frog'),
    imageUrl: PostImageUrl.create('https://picsum.photos/seed/deploying/800/600'),
    excerpt: PostExcerpt.create(
      'One Dockerfile per package, a reverse proxy in front, and a single '
      '`docker compose up` for the whole stack. No Kubernetes required.',
    ),
    body: PostBody.create(
      '## Building Flutter web\n\n'
      '```dockerfile\n'
      'FROM ghcr.io/cirruslabs/flutter:stable AS build\n'
      'WORKDIR /app\n'
      'COPY . .\n'
      'RUN flutter build web --release\n'
      '\n'
      'FROM nginx:alpine\n'
      'COPY --from=build /app/build/web /usr/share/nginx/html\n'
      '```\n\n'
      '## Building the Dart Frog API\n\n'
      '```dockerfile\n'
      'FROM dart:stable AS build\n'
      'WORKDIR /app\n'
      'COPY . .\n'
      'RUN dart pub get && dart compile exe bin/server.dart -o bin/server\n'
      '\n'
      'FROM scratch\n'
      'COPY --from=build /app/bin/server /server\n'
      'CMD ["/server"]\n'
      '```\n\n'
      '## Reverse proxy\n\n'
      'Nginx routes `/api/` to the Dart Frog container and everything else '
      'to the Flutter web container. Both share a Docker network. '
      'CORS is not needed because requests stay on the same origin.',
    ),
    publishedAt: PostPublishedAt.create(DateTime.utc(2025, 6, 18)),
  ),
];
