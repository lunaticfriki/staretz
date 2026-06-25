import 'dart:io';

import 'package:dart_frog/dart_frog.dart';
import 'package:staretz_back/blog/application/post.read_service.dart';
import 'package:staretz_back/blog/application/post.write_service.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';

Future<Response> onRequest(RequestContext context, String slug) async {
  return switch (context.request.method) {
    HttpMethod.get => _getOne(context, slug),
    HttpMethod.delete => _delete(context, slug),
    _ => Future.value(Response(statusCode: HttpStatus.methodNotAllowed)),
  };
}

Future<Response> _getOne(RequestContext context, String slug) async {
  final svc = context.read<PostReadService>();
  final post = await svc.getBySlug(PostSlug.create(slug));
  if (post == null) return Response(statusCode: HttpStatus.notFound);
  return Response.json(body: _postToJson(post));
}

Future<Response> _delete(RequestContext context, String slug) async {
  final svc = context.read<PostWriteService>();
  await svc.delete(PostSlug.create(slug));
  return Response(statusCode: HttpStatus.noContent);
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
