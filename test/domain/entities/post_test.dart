import 'package:flutter_test/flutter_test.dart';
import 'package:staretz/domain/entities/post.dart';
import 'package:staretz/domain/value_objects/title.dart';
import 'package:staretz/domain/value_objects/author.dart';
import 'package:staretz/domain/value_objects/content.dart';
import 'package:staretz/domain/value_objects/tag.dart';
import 'package:staretz/domain/value_objects/slug.dart';

import '../../utils/post_mother.dart';

void main() {
  group('Post Entity', () {
    test('should create a valid Post from Post.create', () {
      final titleStr = 'My Test Title';

      final post = Post.create(
        id: '123',
        title: Title(titleStr),
        author: const Author('John Doe'),
        createdAt: DateTime(2025, 1, 1),
        content: const Content('Content body'),
        tags: const [Tag('test')],
        slug: const Slug('my-test-title'),
        images: const [],
      );

      expect(post.id, '123');
      expect(post.title.value, titleStr);
      expect(post.author.value, 'John Doe');
      expect(post.content.value, 'Content body');
    });

    test('should create an empty post using Post.empty', () {
      final post = Post.empty();

      expect(post.id, isEmpty);
      expect(post.title.value, isEmpty);
      expect(post.author.value, isEmpty);
      expect(post.tags, isEmpty);
      expect(post.images, isEmpty);
    });

    test('should create a valid post using PostMother', () {
      final post = PostMother.create(title: const Title('Mother Title'));

      expect(post.id, isNotEmpty);
      expect(post.title.value, 'Mother Title');
    });
  });
}
