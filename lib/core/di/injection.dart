import 'package:get_it/get_it.dart';
import '../../application/cubit/post_cubit.dart';
import '../../application/cubit/theme_cubit.dart';
import '../../application/services/post_app_service.dart';
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
  // Await shared preferences init
  final prefs = await SharedPreferences.getInstance();
  getIt.registerLazySingleton<SharedPreferences>(() => prefs);

  // Infrastructure Layer
  getIt.registerLazySingleton<ThemeService>(
    () => SharedPrefsThemeService(getIt<SharedPreferences>()),
  );
  getIt.registerLazySingleton<ReadService>(() => InMemoryReadService());
  getIt.registerLazySingleton<WriteService>(() => InMemoryWriteService());
  getIt.registerLazySingleton<StateService>(() => InMemoryStateService());

  // Application Layer
  getIt.registerFactory<PostAppService>(
    () => PostAppService(
      getIt<ReadService>(),
      getIt<WriteService>(),
      getIt<StateService>(),
    ),
  );

  // Presentation Layer - Cubits
  getIt.registerFactory<PostCubit>(() => PostCubit(getIt<PostAppService>()));
  getIt.registerFactory<ThemeCubit>(() => ThemeCubit(getIt<ThemeService>()));
}
