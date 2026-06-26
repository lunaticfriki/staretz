import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_body.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_id.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_title.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz_domain/shared/pagination/paginated.dart';

class HttpPostRepository implements PostRepository {
  final String _baseUrl;
  final http.Client _client;

  HttpPostRepository(this._baseUrl, {http.Client? client})
      : _client = client ?? http.Client();

  @override
  Future<List<Post>> findPreview(int limit) async {
    final uri = Uri.parse('$_baseUrl/posts?page=1&pageSize=$limit');
    final response = await _client.get(uri);
    _assertOk(response);
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return (data['items'] as List)
        .cast<Map<String, dynamic>>()
        .map(_jsonToPost)
        .toList();
  }

  @override
  Future<Paginated<Post>> findPage(PageCriteria criteria) async {
    final uri = Uri.parse(
      '$_baseUrl/posts?page=${criteria.page}&pageSize=${criteria.pageSize}',
    );
    final response = await _client.get(uri);
    _assertOk(response);
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return Paginated(
      items: (data['items'] as List)
          .cast<Map<String, dynamic>>()
          .map(_jsonToPost)
          .toList(),
      totalCount: data['totalCount'] as int,
      criteria: criteria,
    );
  }

  @override
  Future<Post?> findBySlug(PostSlug slug) async {
    final uri = Uri.parse('$_baseUrl/posts/${slug.value}');
    final response = await _client.get(uri);
    if (response.statusCode == 404) return null;
    _assertOk(response);
    return _jsonToPost(jsonDecode(response.body) as Map<String, dynamic>);
  }

  @override
  Future<void> save(Post post) async {
    final uri = Uri.parse('$_baseUrl/posts');
    await _client.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(_postToJson(post)),
    );
  }

  @override
  Future<void> update(PostSlug originalSlug, Post post) async {
    final uri = Uri.parse('$_baseUrl/posts/${originalSlug.value}');
    await _client.put(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(_postToJson(post)),
    );
  }

  @override
  Future<void> delete(PostSlug slug) async {
    final uri = Uri.parse('$_baseUrl/posts/${slug.value}');
    await _client.delete(uri);
  }

  void _assertOk(http.Response response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('HTTP ${response.statusCode}');
    }
  }

  Post _jsonToPost(Map<String, dynamic> json) => Post.create(
        id: PostId.create(json['id'] as String),
        title: PostTitle.create(json['title'] as String),
        slug: PostSlug.create(json['slug'] as String),
        imageUrl: PostImageUrl.create(json['imageUrl'] as String),
        excerpt: PostExcerpt.create(json['excerpt'] as String),
        body: PostBody.create(json['body'] as String),
        publishedAt: PostPublishedAt.create(
          DateTime.parse(json['publishedAt'] as String),
        ),
      );

  Map<String, dynamic> _postToJson(Post post) => {
        'id': post.id.value,
        'title': post.title.value,
        'slug': post.slug.value,
        'imageUrl': post.imageUrl.value,
        'excerpt': post.excerpt.value,
        'body': post.body.value,
        'publishedAt': post.publishedAt.value.toIso8601String(),
      };
}
