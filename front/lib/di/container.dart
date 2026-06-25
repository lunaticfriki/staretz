import 'package:get_it/get_it.dart';
import 'package:staretz/blog/application/post.read_service.dart';
import 'package:staretz/blog/application/post.state_service.dart';
import 'package:staretz/dashboard/application/post.write_service.dart';
import 'package:staretz/dashboard/application/post_edit.state_service.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';
import 'package:staretz/dashboard/infrastructure/http_post_repository.dart';
import 'package:staretz/blog/infrastructure/markdown_post_repository.dart';
import 'package:staretz/shared/application/theme.read_service.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme.write_service.dart';
import 'package:staretz_domain/shared/domain/theme_repository.dart';
import 'package:staretz/shared/infrastructure/local_storage_theme_repository.dart';

const _apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:8080',
);

void setupDi({Map<String, String> rawPosts = const {}}) {
  final sl = GetIt.instance;
  _registerShared(sl);
  _registerBlog(sl, rawPosts);
  _registerDashboard(sl);
}

void _registerShared(GetIt sl) {
  sl.registerLazySingleton<ThemeRepository>(
    () => LocalStorageThemeRepository(),
  );
  sl.registerLazySingleton(() => ThemeReadService(sl()));
  sl.registerLazySingleton(() => ThemeWriteService(sl()));
  sl.registerFactory(() => ThemeStateService(sl(), sl()));
}

void _registerBlog(GetIt sl, Map<String, String> rawPosts) {
  sl.registerLazySingleton<PostRepository>(
    () => MarkdownPostRepository(rawPosts),
  );
  sl.registerLazySingleton(() => PostReadService(sl()));
  sl.registerFactory(() => PostStateService(sl()));
}

void _registerDashboard(GetIt sl) {
  sl.registerLazySingleton<HttpPostRepository>(
    () => HttpPostRepository(_apiBaseUrl),
  );
  sl.registerLazySingleton(
    () => PostEditStateService(
      PostReadService(sl<HttpPostRepository>()),
      PostWriteService(sl<HttpPostRepository>()),
    ),
  );
}
