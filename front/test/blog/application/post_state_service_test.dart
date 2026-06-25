import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:staretz/blog/application/post.read_service.dart';
import 'package:staretz/blog/application/post.state_service.dart';
import 'package:staretz/blog/application/post_state.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz_domain/shared/pagination/paginated.dart';
import '../../mothers/blog/post.mother.dart';

class MockPostRepository extends Mock implements PostRepository {}

void main() {
  late MockPostRepository repository;
  late PostReadService readService;
  late PostStateService svc;

  setUpAll(() {
    registerFallbackValue(PostSlug.create('fallback'));
    registerFallbackValue(const PageCriteria(page: 1, pageSize: 20));
  });

  setUp(() {
    repository = MockPostRepository();
    readService = PostReadService(repository);
    svc = PostStateService(readService);
  });

  tearDown(() => svc.close());

  group('PostStateService.loadPreview', () {
    test('emits loading then loaded with posts', () async {
      when(() => repository.findPreview(5))
          .thenAnswer((_) async => [PostMother.valid()]);

      final expectation = expectLater(
        svc.stream,
        emitsInOrder([
          isA<PostState>()
              .having((s) => s.status, 'status', PostStatus.loading),
          isA<PostState>()
              .having((s) => s.status, 'status', PostStatus.loaded)
              .having((s) => s.posts.length, 'posts length', 1),
        ]),
      );

      await svc.loadPreview(5);
      await expectation;
    });
  });

  group('PostStateService.loadPage', () {
    test('emits loading then loaded with totalCount', () async {
      const criteria = PageCriteria(page: 1, pageSize: 20);
      when(() => repository.findPage(criteria)).thenAnswer(
        (_) async => Paginated(
          items: [PostMother.valid()],
          totalCount: 25,
          criteria: criteria,
        ),
      );

      final expectation = expectLater(
        svc.stream,
        emitsInOrder([
          isA<PostState>()
              .having((s) => s.status, 'status', PostStatus.loading),
          isA<PostState>()
              .having((s) => s.status, 'status', PostStatus.loaded)
              .having((s) => s.totalCount, 'totalCount', 25)
              .having((s) => s.posts.length, 'posts length', 1),
        ]),
      );

      await svc.loadPage(criteria);
      await expectation;
    });
  });

  group('PostStateService.loadBySlug', () {
    test('emits loading then loaded with selectedPost', () async {
      final slug = PostSlug.create('test-post');
      when(() => repository.findBySlug(slug))
          .thenAnswer((_) async => PostMother.valid());

      final expectation = expectLater(
        svc.stream,
        emitsInOrder([
          isA<PostState>()
              .having((s) => s.status, 'status', PostStatus.loading),
          isA<PostState>()
              .having((s) => s.status, 'status', PostStatus.loaded)
              .having((s) => s.selectedPost, 'selectedPost', isNotNull),
        ]),
      );

      await svc.loadBySlug(slug);
      await expectation;
    });

    test('selectedPost is null when slug not found', () async {
      final slug = PostSlug.create('missing');
      when(() => repository.findBySlug(slug)).thenAnswer((_) async => null);

      final expectation = expectLater(
        svc.stream,
        emitsInOrder([
          isA<PostState>()
              .having((s) => s.status, 'status', PostStatus.loading),
          isA<PostState>()
              .having((s) => s.status, 'status', PostStatus.loaded)
              .having((s) => s.selectedPost, 'selectedPost', isNull),
        ]),
      );

      await svc.loadBySlug(slug);
      await expectation;
    });
  });
}
