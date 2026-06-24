import 'package:flutter_test/flutter_test.dart';
import 'package:staretz/blog/domain/value_objects/post_body.dart';
import 'package:staretz/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz/blog/domain/value_objects/post_id.dart';
import 'package:staretz/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/domain/value_objects/post_title.dart';
import 'package:staretz/shared/pagination/page_criteria.dart';
import 'package:staretz/shared/pagination/paginated.dart';

void main() {
  group('PostId', () {
    test('creates with valid value', () {
      expect(PostId.create('abc').value, 'abc');
    });
    test('trims whitespace', () {
      expect(PostId.create('  1  ').value, '1');
    });
    test('throws on empty', () {
      expect(() => PostId.create(''), throwsArgumentError);
    });
    test('equality', () {
      expect(PostId.create('x'), PostId.create('x'));
      expect(PostId.create('x'), isNot(PostId.create('y')));
    });
  });

  group('PostTitle', () {
    test('creates with valid value', () {
      expect(PostTitle.create('Hello').value, 'Hello');
    });
    test('trims whitespace', () {
      expect(PostTitle.create('  Hi  ').value, 'Hi');
    });
    test('throws on empty', () {
      expect(() => PostTitle.create(''), throwsArgumentError);
    });
    test('equality', () {
      expect(PostTitle.create('A'), PostTitle.create('A'));
      expect(PostTitle.create('A'), isNot(PostTitle.create('B')));
    });
  });

  group('PostSlug', () {
    test('creates with valid value', () {
      expect(PostSlug.create('my-post').value, 'my-post');
    });
    test('throws on empty', () {
      expect(() => PostSlug.create(''), throwsArgumentError);
    });
    test('equality', () {
      expect(PostSlug.create('a'), PostSlug.create('a'));
    });
  });

  group('PostImageUrl', () {
    test('creates with valid value', () {
      expect(
        PostImageUrl.create('https://example.com/img.jpg').value,
        'https://example.com/img.jpg',
      );
    });
    test('throws on empty', () {
      expect(() => PostImageUrl.create(''), throwsArgumentError);
    });
  });

  group('PostExcerpt', () {
    test('creates with valid value', () {
      expect(PostExcerpt.create('Short.').value, 'Short.');
    });
    test('throws on empty', () {
      expect(() => PostExcerpt.create(''), throwsArgumentError);
    });
  });

  group('PostBody', () {
    test('accepts empty body', () {
      expect(PostBody.create('').value, '');
    });
    test('stores content', () {
      expect(PostBody.create('Content here.').value, 'Content here.');
    });
  });

  group('PostPublishedAt', () {
    test('stores date', () {
      final date = DateTime(2026, 6, 1);
      expect(PostPublishedAt.create(date).value, date);
    });
    test('equality', () {
      final d = DateTime(2026, 1, 1);
      expect(PostPublishedAt.create(d), PostPublishedAt.create(d));
    });
  });

  group('PageCriteria', () {
    test('offset is (page-1) * pageSize', () {
      expect(const PageCriteria(page: 3, pageSize: 20).offset, 40);
    });
    test('next increments page', () {
      expect(const PageCriteria(page: 1, pageSize: 20).next().page, 2);
    });
    test('previous decrements page', () {
      expect(const PageCriteria(page: 3, pageSize: 20).previous().page, 2);
    });
    test('equality', () {
      expect(
        const PageCriteria(page: 1, pageSize: 20),
        const PageCriteria(page: 1, pageSize: 20),
      );
    });
  });

  group('Paginated', () {
    const criteria = PageCriteria(page: 1, pageSize: 20);

    test('totalPages rounds up', () {
      expect(
        Paginated(items: <int>[], totalCount: 25, criteria: criteria).totalPages,
        2,
      );
    });
    test('hasNext when more pages exist', () {
      expect(
        Paginated(items: <int>[], totalCount: 25, criteria: criteria).hasNext,
        isTrue,
      );
    });
    test('hasPrevious on page 1 is false', () {
      expect(
        Paginated(items: <int>[], totalCount: 25, criteria: criteria).hasPrevious,
        isFalse,
      );
    });
    test('hasPrevious on page 2 is true', () {
      expect(
        Paginated(
          items: <int>[],
          totalCount: 25,
          criteria: const PageCriteria(page: 2, pageSize: 20),
        ).hasPrevious,
        isTrue,
      );
    });
  });
}
