import 'package:staretz_back/blog/infrastructure/in_memory_post_repository.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_body.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_id.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_title.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:test/test.dart';
import '../../mothers/blog/post.mother.dart';

void main() {
  late InMemoryPostRepository repo;

  setUp(() => repo = InMemoryPostRepository());

  group('InMemoryPostRepository', () {
    test('findPreview returns up to limit items sorted by date desc', () async {
      final result = await repo.findPreview(2);

      expect(result.length, 2);
      expect(
        result.first.publishedAt.value
            .isAfter(result.last.publishedAt.value),
        isTrue,
      );
    });

    test('findPreview clamps to total when limit exceeds count', () async {
      final result = await repo.findPreview(999);
      expect(result.length, 20);
    });

    test('findPage returns correct slice and totalCount', () async {
      const criteria = PageCriteria(page: 1, pageSize: 3);
      final page = await repo.findPage(criteria);

      expect(page.items.length, 3);
      expect(page.totalCount, 20);
    });

    test('findPage page 2 returns remaining items', () async {
      const criteria = PageCriteria(page: 2, pageSize: 17);
      final page = await repo.findPage(criteria);

      expect(page.items.length, 3);
    });

    test('findBySlug returns matching post', () async {
      final post =
          await repo.findBySlug(PostSlug.create('hexagonal-architecture-dart'));

      expect(post, isNotNull);
      expect(post!.slug.value, 'hexagonal-architecture-dart');
    });

    test('findBySlug returns null for unknown slug', () async {
      final post = await repo.findBySlug(PostSlug.create('does-not-exist'));
      expect(post, isNull);
    });

    test('save adds a new post', () async {
      final post = PostMother.valid();
      await repo.save(post);

      final found = await repo.findBySlug(post.slug);
      expect(found, isNotNull);
    });

    test('save updates an existing post', () async {
      final original = PostMother.valid();
      await repo.save(original);

      final updated = PostMother.withTitle(original.id.value, 'Updated Title');
      await repo.save(updated);

      final page = await repo.findPage(const PageCriteria(page: 1, pageSize: 100));
      final titles =
          page.items.where((p) => p.id.value == original.id.value).toList();
      expect(titles.length, 1);
      expect(titles.first.title.value, 'Updated Title');
    });

    test('delete removes the post', () async {
      final post = PostMother.valid();
      await repo.save(post);

      await repo.delete(post.slug);

      final found = await repo.findBySlug(post.slug);
      expect(found, isNull);
    });

    test('update changes fields but preserves id and publishedAt', () async {
      final original = PostMother.valid();
      await repo.save(original);

      final edits = Post.create(
        id: PostId.create('ignored'),
        title: PostTitle.create('New Title'),
        slug: PostSlug.create('new-slug'),
        imageUrl: PostImageUrl.create('https://example.com/new.jpg'),
        excerpt: PostExcerpt.create('New excerpt.'),
        body: PostBody.create('New body.'),
        publishedAt: PostPublishedAt.create(DateTime(2099, 1, 1)),
      );

      await repo.update(original.slug, edits);

      final found = await repo.findBySlug(PostSlug.create('new-slug'));
      expect(found, isNotNull);
      expect(found!.id, original.id);
      expect(found.publishedAt, original.publishedAt);
      expect(found.title.value, 'New Title');
    });

    test('update on unknown slug does nothing', () async {
      final before =
          await repo.findPage(const PageCriteria(page: 1, pageSize: 100));

      await repo.update(PostSlug.create('ghost'), PostMother.valid());

      final after =
          await repo.findPage(const PageCriteria(page: 1, pageSize: 100));
      expect(after.totalCount, before.totalCount);
    });

    test('delete on unknown slug does nothing', () async {
      final before =
          await repo.findPage(const PageCriteria(page: 1, pageSize: 100));

      await repo.delete(PostSlug.create('ghost'));

      final after =
          await repo.findPage(const PageCriteria(page: 1, pageSize: 100));
      expect(after.totalCount, before.totalCount);
    });
  });
}
