import 'package:get_it/get_it.dart';
import 'package:staretz/blog/application/post.read_service.dart';
import 'package:staretz/blog/application/post.state_service.dart';
import 'package:staretz/blog/domain/ports/post_repository.dart';
import 'package:staretz/blog/infrastructure/json_post_repository.dart';
import 'package:staretz/shared/application/theme.read_service.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme.write_service.dart';
import 'package:staretz/shared/domain/theme_repository.dart';
import 'package:staretz/shared/infrastructure/local_storage_theme_repository.dart';

void setupDi({List<Map<String, dynamic>> postsData = const []}) {
  final sl = GetIt.instance;
  _registerShared(sl);
  _registerBlog(sl, postsData);
}

void _registerShared(GetIt sl) {
  sl.registerLazySingleton<ThemeRepository>(
    () => LocalStorageThemeRepository(),
  );
  sl.registerLazySingleton(() => ThemeReadService(sl()));
  sl.registerLazySingleton(() => ThemeWriteService(sl()));
  sl.registerFactory(() => ThemeStateService(sl(), sl()));
}

void _registerBlog(GetIt sl, List<Map<String, dynamic>> postsData) {
  sl.registerLazySingleton<PostRepository>(
    () => JsonPostRepository(postsData),
  );
  sl.registerLazySingleton(() => PostReadService(sl()));
  sl.registerFactory(() => PostStateService(sl()));
}
