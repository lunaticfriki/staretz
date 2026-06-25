import 'package:get_it/get_it.dart';
import 'package:staretz/blog/application/post.read_service.dart';
import 'package:staretz/blog/application/post.state_service.dart';
import 'package:staretz/blog/domain/ports/post_repository.dart';
import 'package:staretz/blog/infrastructure/markdown_post_repository.dart';
import 'package:staretz/shared/application/theme.read_service.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme.write_service.dart';
import 'package:staretz/shared/domain/theme_repository.dart';
import 'package:staretz/shared/infrastructure/local_storage_theme_repository.dart';

void setupDi({Map<String, String> rawPosts = const {}}) {
  final sl = GetIt.instance;
  _registerShared(sl);
  _registerBlog(sl, rawPosts);
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
