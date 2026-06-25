import 'dart:io';

import 'package:dart_frog/dart_frog.dart';
import 'package:staretz_back/blog/application/post.read_service.dart';
import 'package:staretz_back/blog/application/post.write_service.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_body.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_id.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_title.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';

Future<Response> onRequest(RequestContext context) async {
  return switch (context.request.method) {
    HttpMethod.get => _getAll(context),
    HttpMethod.post => _create(context),
    _ => Future.value(Response(statusCode: HttpStatus.methodNotAllowed)),
  };
}

Future<Response> _getAll(RequestContext context) async {
  final svc = context.read<PostReadService>();
  final params = context.request.uri.queryParameters;
  final page = int.tryParse(params['page'] ?? '1') ?? 1;
  final pageSize = int.tryParse(params['pageSize'] ?? '20') ?? 20;

  final result = await svc.getPage(PageCriteria(page: page, pageSize: pageSize));
  return Response.json(
    body: {
      'items': result.items.map(_postToJson).toList(),
      'totalCount': result.totalCount,
      'page': result.criteria.page,
      'pageSize': result.criteria.pageSize,
      'totalPages': result.totalPages,
    },
  );
}

Future<Response> _create(RequestContext context) async {
  final svc = context.read<PostWriteService>();
  final body = await context.request.json() as Map<String, dynamic>;

  final post = Post.create(
    id: PostId.create(body['id'] as String),
    title: PostTitle.create(body['title'] as String),
    slug: PostSlug.create(body['slug'] as String),
    imageUrl: PostImageUrl.create(body['imageUrl'] as String),
    excerpt: PostExcerpt.create(body['excerpt'] as String),
    body: PostBody.create(body['body'] as String),
    publishedAt: PostPublishedAt.create(
      DateTime.parse(body['publishedAt'] as String),
    ),
  );

  await svc.save(post);
  return Response.json(statusCode: HttpStatus.created, body: _postToJson(post));
}

Map<String, dynamic> _postToJson(Post post) => {
      'id': post.id.value,
      'title': post.title.value,
      'slug': post.slug.value,
      'imageUrl': post.imageUrl.value,
      'excerpt': post.excerpt.value,
      'body': post.body.value,
      'publishedAt': post.publishedAt.value.toIso8601String(),
    };
