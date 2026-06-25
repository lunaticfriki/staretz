import 'dart:io';

import 'package:postgres/postgres.dart';
import 'package:staretz_back/blog/application/post.read_service.dart';
import 'package:staretz_back/blog/application/post.write_service.dart';
import 'package:staretz_back/blog/infrastructure/in_memory_post_repository.dart';
import 'package:staretz_back/blog/infrastructure/postgres_post_repository.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';

class AppContainer {
  final PostReadService postReadService;
  final PostWriteService postWriteService;

  AppContainer._({
    required this.postReadService,
    required this.postWriteService,
  });

  static Future<AppContainer> build() async {
    final PostRepository repo = Platform.environment['USE_DB'] == '1'
        ? await _buildPostgresRepo()
        : InMemoryPostRepository();

    return AppContainer._(
      postReadService: PostReadService(repo),
      postWriteService: PostWriteService(repo),
    );
  }

  static Future<PostgresPostRepository> _buildPostgresRepo() async {
    final db = await Connection.open(
      Endpoint(
        host: Platform.environment['DB_HOST'] ?? 'localhost',
        port: int.parse(Platform.environment['DB_PORT'] ?? '5432'),
        database: Platform.environment['DB_NAME'] ?? 'staretz',
        username: Platform.environment['DB_USER'] ?? 'staretz',
        password: Platform.environment['DB_PASSWORD'] ?? '',
      ),
      settings: const ConnectionSettings(sslMode: SslMode.disable),
    );
    return PostgresPostRepository(db);
  }
}
