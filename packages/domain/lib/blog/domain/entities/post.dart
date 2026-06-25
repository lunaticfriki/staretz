import 'package:staretz_domain/blog/domain/value_objects/post_body.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_id.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_title.dart';

class Post {
  final PostId id;
  final PostTitle title;
  final PostSlug slug;
  final PostImageUrl imageUrl;
  final PostExcerpt excerpt;
  final PostBody body;
  final PostPublishedAt publishedAt;

  Post._({
    required this.id,
    required this.title,
    required this.slug,
    required this.imageUrl,
    required this.excerpt,
    required this.body,
    required this.publishedAt,
  });

  factory Post.create({
    required PostId id,
    required PostTitle title,
    required PostSlug slug,
    required PostImageUrl imageUrl,
    required PostExcerpt excerpt,
    required PostBody body,
    required PostPublishedAt publishedAt,
  }) =>
      Post._(
        id: id,
        title: title,
        slug: slug,
        imageUrl: imageUrl,
        excerpt: excerpt,
        body: body,
        publishedAt: publishedAt,
      );

  factory Post.empty() => Post._(
        id: PostId.empty(),
        title: PostTitle.empty(),
        slug: PostSlug.empty(),
        imageUrl: PostImageUrl.empty(),
        excerpt: PostExcerpt.empty(),
        body: PostBody.empty(),
        publishedAt: PostPublishedAt.empty(),
      );
}
