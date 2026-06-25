import 'package:mocktail/mocktail.dart';
import 'package:staretz_back/blog/application/post.read_service.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz_domain/shared/pagination/paginated.dart';
import 'package:test/test.dart';
import '../../mothers/blog/post.mother.dart';

class MockPostRepository extends Mock implements PostRepository {}

void main() {
  late MockPostRepository repository;
  late PostReadService svc;

  setUpAll(() {
    registerFallbackValue(PostSlug.create('fallback'));
    registerFallbackValue(const PageCriteria(page: 1, pageSize: 20));
  });

  setUp(() {
    repository = MockPostRepository();
    svc = PostReadService(repository);
  });

  group('PostReadService', () {
    test('getPreview delegates to findPreview', () async {
      final posts = [PostMother.valid()];
      when(() => repository.findPreview(5)).thenAnswer((_) async => posts);

      final result = await svc.getPreview(5);

      expect(result, posts);
      verify(() => repository.findPreview(5)).called(1);
    });

    test('getPage delegates to findPage', () async {
      const criteria = PageCriteria(page: 1, pageSize: 20);
      final page = Paginated(
        items: [PostMother.valid()],
        totalCount: 1,
        criteria: criteria,
      );
      when(() => repository.findPage(criteria)).thenAnswer((_) async => page);

      final result = await svc.getPage(criteria);

      expect(result.items.length, 1);
      verify(() => repository.findPage(criteria)).called(1);
    });

    test('getBySlug returns null when not found', () async {
      final slug = PostSlug.create('missing');
      when(() => repository.findBySlug(slug)).thenAnswer((_) async => null);

      final result = await svc.getBySlug(slug);

      expect(result, isNull);
    });
  });
}
