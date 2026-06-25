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
import 'package:yaml/yaml.dart';

class MarkdownPostRepository implements PostRepository {
  final List<String> _slugs;
  final Map<String, String> _raw; // slug → raw file content
  final Map<String, Post> _cache = {};

  MarkdownPostRepository(Map<String, String> rawContents)
      : _slugs = rawContents.keys.toList(),
        _raw = rawContents;

  Post _get(String slug) => _cache[slug] ??= _parse(_raw[slug]!);

  Post _parse(String raw) {
    final parts = raw.split(RegExp(r'^---\s*$', multiLine: true));
    final front = loadYaml(parts[1]) as YamlMap;
    final body = parts[2].trim();
    return Post.create(
      id: PostId.create(front['id'] as String),
      title: PostTitle.create(front['title'] as String),
      slug: PostSlug.create(front['slug'] as String),
      imageUrl: PostImageUrl.create(front['imageUrl'] as String),
      excerpt: PostExcerpt.create(front['excerpt'] as String),
      body: PostBody.create(body),
      publishedAt: PostPublishedAt.create(
        DateTime.parse(front['publishedAt'] as String),
      ),
    );
  }

  @override
  Future<List<Post>> findPreview(int limit) async =>
      _slugs.take(limit).map(_get).toList();

  @override
  Future<Paginated<Post>> findPage(PageCriteria criteria) async {
    final items = _slugs
        .skip(criteria.offset)
        .take(criteria.pageSize)
        .map(_get)
        .toList();
    return Paginated(items: items, totalCount: _slugs.length, criteria: criteria);
  }

  @override
  Future<Post?> findBySlug(PostSlug slug) async {
    if (!_raw.containsKey(slug.value)) return null;
    return _get(slug.value);
  }
}
