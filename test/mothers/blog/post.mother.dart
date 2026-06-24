import 'package:staretz/blog/domain/entities/post.dart';
import 'package:staretz/blog/domain/value_objects/post_body.dart';
import 'package:staretz/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz/blog/domain/value_objects/post_id.dart';
import 'package:staretz/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/domain/value_objects/post_title.dart';

class PostMother {
  static Post valid() => Post.create(
        id: PostId.create('1'),
        title: PostTitle.create('Test Post'),
        slug: PostSlug.create('test-post'),
        imageUrl: PostImageUrl.create('https://example.com/image.jpg'),
        excerpt: PostExcerpt.create('A short excerpt.'),
        body: PostBody.create('Full body content.'),
        publishedAt: PostPublishedAt.create(DateTime(2026, 1, 1)),
      );

  static Post withSlug(String slug) => Post.create(
        id: PostId.create('2'),
        title: PostTitle.create('Post $slug'),
        slug: PostSlug.create(slug),
        imageUrl: PostImageUrl.create('https://example.com/image.jpg'),
        excerpt: PostExcerpt.create('Excerpt for $slug.'),
        body: PostBody.create('Body for $slug.'),
        publishedAt: PostPublishedAt.create(DateTime(2026, 6, 1)),
      );
}
