import 'package:staretz/blog/domain/entities/post.dart';
import 'package:staretz/blog/domain/ports/post_repository.dart';
import 'package:staretz/blog/domain/value_objects/post_body.dart';
import 'package:staretz/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz/blog/domain/value_objects/post_id.dart';
import 'package:staretz/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/domain/value_objects/post_title.dart';
import 'package:staretz/shared/pagination/page_criteria.dart';
import 'package:staretz/shared/pagination/paginated.dart';

class JsonPostRepository implements PostRepository {
  final List<Map<String, dynamic>> _data;

  JsonPostRepository(this._data);

  @override
  Future<List<Post>> findPreview(int limit) async =>
      _data.take(limit).map(_fromJson).toList();

  @override
  Future<Paginated<Post>> findPage(PageCriteria criteria) async {
    final items = _data
        .skip(criteria.offset)
        .take(criteria.pageSize)
        .map(_fromJson)
        .toList();
    return Paginated(items: items, totalCount: _data.length, criteria: criteria);
  }

  @override
  Future<Post?> findBySlug(PostSlug slug) async {
    final entry = _data.cast<Map<String, dynamic>?>().firstWhere(
          (e) => e!['slug'] == slug.value,
          orElse: () => null,
        );
    return entry == null ? null : _fromJson(entry);
  }

  Post _fromJson(Map<String, dynamic> json) => Post.create(
        id: PostId.create(json['id'] as String),
        title: PostTitle.create(json['title'] as String),
        slug: PostSlug.create(json['slug'] as String),
        imageUrl: PostImageUrl.create(json['imageUrl'] as String),
        excerpt: PostExcerpt.create(json['excerpt'] as String),
        body: PostBody.create(json['body'] as String),
        publishedAt: PostPublishedAt.create(
            DateTime.parse(json['publishedAt'] as String)),
      );
}
