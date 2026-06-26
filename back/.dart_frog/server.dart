// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, implicit_dynamic_list_literal

import 'dart:io';

import 'package:dart_frog/dart_frog.dart';


import '../routes/index.dart' as index;
import '../routes/posts/index.dart' as posts_index;
import '../routes/posts/[slug].dart' as posts_$slug;
import '../routes/docs/openapi.dart' as docs_openapi;
import '../routes/docs/index.dart' as docs_index;

import '../routes/_middleware.dart' as middleware;

void main() async {
  final address = InternetAddress.tryParse('') ?? InternetAddress.anyIPv6;
  final port = int.tryParse(Platform.environment['PORT'] ?? '8080') ?? 8080;
  hotReload(() => createServer(address, port));
}

Future<HttpServer> createServer(InternetAddress address, int port) {
  final handler = Cascade().add(buildRootHandler()).handler;
  return serve(handler, address, port);
}

Handler buildRootHandler() {
  final pipeline = const Pipeline().addMiddleware(middleware.middleware);
  final router = Router()
    ..mount('/', (context) => buildHandler()(context))
    ..mount('/posts', (context) => buildPostsHandler()(context))
    ..mount('/docs', (context) => buildDocsHandler()(context));
  return pipeline.addHandler(router);
}

Handler buildHandler() {
  final pipeline = const Pipeline();
  final router = Router()
    ..all('/', (context) => index.onRequest(context,));
  return pipeline.addHandler(router);
}

Handler buildPostsHandler() {
  final pipeline = const Pipeline();
  final router = Router()
    ..all('/<slug>', (context,slug,) => posts_$slug.onRequest(context,slug,))..all('/', (context) => posts_index.onRequest(context,));
  return pipeline.addHandler(router);
}

Handler buildDocsHandler() {
  final pipeline = const Pipeline();
  final router = Router()
    ..all('/openapi', (context) => docs_openapi.onRequest(context,))..all('/', (context) => docs_index.onRequest(context,));
  return pipeline.addHandler(router);
}

