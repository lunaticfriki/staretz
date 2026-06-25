import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_body.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_id.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_title.dart';

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

  static Post withTitle(String id, String title) => Post.create(
        id: PostId.create(id),
        title: PostTitle.create(title),
        slug: PostSlug.create('test-post'),
        imageUrl: PostImageUrl.create('https://example.com/image.jpg'),
        excerpt: PostExcerpt.create('A short excerpt.'),
        body: PostBody.create('Full body content.'),
        publishedAt: PostPublishedAt.create(DateTime(2026, 1, 1)),
      );
}
