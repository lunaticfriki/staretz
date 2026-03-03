import 'package:get_it/get_it.dart';
import '../../application/cubit/post_cubit.dart';
import '../../application/cubit/theme_cubit.dart';
import '../../application/services/read_app_service.dart';
import '../../application/services/write_app_service.dart';
import '../../application/services/state_app_service.dart';
import '../../domain/services/read_service.dart';
import '../../domain/services/state_service.dart';
import '../../domain/services/write_service.dart';
import '../../infrastructure/services/in_memory_read_service.dart';
import '../../infrastructure/services/in_memory_state_service.dart';
import '../../infrastructure/services/in_memory_write_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../domain/services/theme_service.dart';
import '../../infrastructure/services/shared_prefs_theme_service.dart';

final getIt = GetIt.instance;

Future<void> setupDependencyInjection() async {
  final prefs = await SharedPreferences.getInstance();
  getIt.registerLazySingleton<SharedPreferences>(() => prefs);

  getIt.registerLazySingleton<ThemeService>(
    () => SharedPrefsThemeService(getIt<SharedPreferences>()),
  );
  getIt.registerLazySingleton<ReadService>(() => InMemoryReadService());
  getIt.registerLazySingleton<WriteService>(() => InMemoryWriteService());
  getIt.registerLazySingleton<StateService>(() => InMemoryStateService());

  getIt.registerFactory<ReadAppService>(
    () => ReadAppService(getIt<ReadService>()),
  );
  getIt.registerFactory<WriteAppService>(
    () => WriteAppService(getIt<WriteService>()),
  );
  getIt.registerFactory<StateAppService>(
    () => StateAppService(getIt<StateService>()),
  );

  getIt.registerFactory<PostCubit>(
    () => PostCubit(
      getIt<ReadAppService>(),
      getIt<WriteAppService>(),
      getIt<StateAppService>(),
    ),
  );
  getIt.registerFactory<ThemeCubit>(() => ThemeCubit(getIt<ThemeService>()));
}
