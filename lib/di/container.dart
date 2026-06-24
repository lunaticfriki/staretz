import 'package:get_it/get_it.dart';
import 'package:staretz/shared/application/theme.read_service.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme.write_service.dart';
import 'package:staretz/shared/domain/theme_repository.dart';
import 'package:staretz/shared/infrastructure/local_storage_theme_repository.dart';

void setupDi() {
  final sl = GetIt.instance;
  _registerShared(sl);
}

void _registerShared(GetIt sl) {
  sl.registerLazySingleton<ThemeRepository>(
    () => LocalStorageThemeRepository(),
  );
  sl.registerLazySingleton(() => ThemeReadService(sl()));
  sl.registerLazySingleton(() => ThemeWriteService(sl()));
  sl.registerFactory(() => ThemeStateService(sl(), sl()));
}
