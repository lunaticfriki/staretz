# Testing Strategy

## Rule: tests are part of the task

Every feature addition or bug fix must include updated or new tests in the same change. A task is not done until `flutter test` and `flutter test integration_test` pass. Broken tests are never left for later.

## Test types

| Type | Location | Tool |
|------|----------|------|
| Unit (domain + application) | `test/` | `flutter_test` + `mockito` |
| Architecture | `test/arch/` | Custom file-scanner helpers |
| E2E | `integration_test/` | `integration_test` package |

---

## Mothers (test data builders)

Every domain entity and value object has a Mother class. Mothers provide valid default instances and named variants. No test file ever instantiates domain objects with raw primitives.

```dart
class PostMother {
  static Post valid() => Post.create(
    id: PostIdMother.valid(),
    title: PostTitleMother.valid(),
    slug: PostSlugMother.valid(),
    excerpt: PostExcerptMother.valid(),
    body: PostBodyMother.valid(),
    publishedAt: PostPublishedAtMother.valid(),
  );

  static Post withTitle(String title) => Post.create(
    id: PostIdMother.valid(),
    title: PostTitle.create(title),
    slug: PostSlugMother.valid(),
    excerpt: PostExcerptMother.valid(),
    body: PostBodyMother.valid(),
    publishedAt: PostPublishedAtMother.valid(),
  );
}
```

Mother files: `test/mothers/<feature>/<entity>.mother.dart`.

---

## Application service tests (mockito)

Mock the repository port; test the service in isolation.

```dart
class MockPostRepository extends Mock implements PostRepository {}

void main() {
  late MockPostRepository repository;
  late PostReadService svc;

  setUp(() {
    repository = MockPostRepository();
    svc = PostReadService(repository);
  });

  test('returns all posts from repository', () async {
    final posts = [PostMother.valid()];
    when(() => repository.findAll()).thenAnswer((_) async => posts);

    final result = await svc.getAllPosts();

    expect(result, posts);
    verify(() => repository.findAll()).called(1);
  });
}
```

No code generation needed — `mocktail` works on any class without annotations.

---

## Architecture tests

Architecture tests live in `test/arch/`. They scan the file system and parse import statements to enforce layer rules and naming conventions.

### Naming convention tests

```dart
void main() {
  test('read services follow naming convention', () {
    final files = findDartFiles('lib').where((f) => f.contains('read_service'));
    for (final file in files) {
      expect(file, endsWith('.read_service.dart'));
    }
  });
}
```

### Layer boundary tests

```dart
void main() {
  test('domain does not import application or infrastructure or presentation', () {
    final domainFiles = findDartFiles('lib/blog/domain');
    for (final file in domainFiles) {
      final imports = readImports(file);
      expect(imports, everyElement(isNot(contains('/application/'))));
      expect(imports, everyElement(isNot(contains('/infrastructure/'))));
      expect(imports, everyElement(isNot(contains('/presentation/'))));
    }
  });

  test('presentation does not import infrastructure', () {
    final presentationFiles = findDartFiles('lib/blog/presentation');
    for (final file in presentationFiles) {
      final imports = readImports(file);
      expect(imports, everyElement(isNot(contains('/infrastructure/'))));
    }
  });
}
```

Helper in `test/arch/arch_test_helpers.dart`:

```dart
List<String> findDartFiles(String dir) =>
    Directory(dir)
        .listSync(recursive: true)
        .whereType<File>()
        .where((f) => f.path.endsWith('.dart'))
        .map((f) => f.path)
        .toList();

List<String> readImports(String filePath) =>
    File(filePath)
        .readAsLinesSync()
        .where((l) => l.trimLeft().startsWith('import '))
        .toList();
```

---

## E2E tests

Integration tests run in a real Flutter app instance via `integration_test`.

```dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('home page shows staretz title', (tester) async {
    await tester.pumpWidget(const StaretzApp());
    await tester.pumpAndSettle();

    expect(find.text('staretz'), findsOneWidget);
  });
}
```

Run: `flutter test integration_test/`.
