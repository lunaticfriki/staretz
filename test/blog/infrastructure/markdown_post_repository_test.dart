import 'package:flutter_test/flutter_test.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/infrastructure/markdown_post_repository.dart';
import 'package:staretz/shared/pagination/page_criteria.dart';

const _firstMd = '''---
id: "1"
title: "First Post"
slug: "first-post"
imageUrl: "https://example.com/img.jpg"
excerpt: "The first post."
publishedAt: "2026-01-01"
---

Body of first post.
''';

const _secondMd = '''---
id: "2"
title: "Second Post"
slug: "second-post"
imageUrl: "https://example.com/img2.jpg"
excerpt: "The second post."
publishedAt: "2026-01-02"
---

Body of second post.
''';

const _thirdMd = '''---
id: "3"
title: "Third Post"
slug: "third-post"
imageUrl: "https://example.com/img3.jpg"
excerpt: "The third post."
publishedAt: "2026-01-03"
---

Body of third post.
''';

final _rawPosts = {
  'first-post': _firstMd,
  'second-post': _secondMd,
  'third-post': _thirdMd,
};

void main() {
  late MarkdownPostRepository repo;

  setUp(() {
    repo = MarkdownPostRepository(_rawPosts);
  });

  group('MarkdownPostRepository', () {
    test('findPreview returns up to limit posts in manifest order', () async {
      final posts = await repo.findPreview(2);

      expect(posts.length, 2);
      expect(posts[0].slug, PostSlug.create('first-post'));
      expect(posts[1].slug, PostSlug.create('second-post'));
    });

    test('findPreview clamps to total when limit exceeds count', () async {
      final posts = await repo.findPreview(100);

      expect(posts.length, 3);
    });

    test('findPage returns correct slice', () async {
      const criteria = PageCriteria(page: 2, pageSize: 2);
      final page = await repo.findPage(criteria);

      expect(page.items.length, 1);
      expect(page.items[0].slug, PostSlug.create('third-post'));
      expect(page.totalCount, 3);
    });

    test('findBySlug returns matching post', () async {
      final slug = PostSlug.create('second-post');
      final post = await repo.findBySlug(slug);

      expect(post, isNotNull);
      expect(post!.title.value, 'Second Post');
      expect(post.body.value, 'Body of second post.');
    });

    test('findBySlug returns null for unknown slug', () async {
      final slug = PostSlug.create('does-not-exist');
      final post = await repo.findBySlug(slug);

      expect(post, isNull);
    });

    test('parses frontmatter fields correctly', () async {
      final posts = await repo.findPreview(1);
      final post = posts[0];

      expect(post.id.value, '1');
      expect(post.title.value, 'First Post');
      expect(post.excerpt.value, 'The first post.');
      expect(post.publishedAt.value, DateTime(2026, 1, 1));
      expect(post.imageUrl.value, 'https://example.com/img.jpg');
    });
  });
}
