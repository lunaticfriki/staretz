import 'package:get_it/get_it.dart';
import '../../application/cubit/post_cubit.dart';
import '../../application/services/post_app_service.dart';
import '../../domain/services/read_service.dart';
import '../../domain/services/state_service.dart';
import '../../domain/services/write_service.dart';
import '../../infrastructure/services/in_memory_read_service.dart';
import '../../infrastructure/services/in_memory_state_service.dart';
import '../../infrastructure/services/in_memory_write_service.dart';

final getIt = GetIt.instance;

void setupDependencyInjection() {
  // Infrastructure Layer
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
}
