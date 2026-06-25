import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:staretz/shared/application/theme.write_service.dart';
import 'package:staretz_domain/shared/domain/app_theme.dart';
import 'package:staretz_domain/shared/domain/theme_repository.dart';
import '../../mothers/shared/app_theme_mother.dart';

class MockThemeRepository extends Mock implements ThemeRepository {}

void main() {
  late MockThemeRepository repository;
  late ThemeWriteService svc;

  setUp(() {
    repository = MockThemeRepository();
    svc = ThemeWriteService(repository);
    registerFallbackValue(AppTheme.system);
  });

  group('ThemeWriteService', () {
    test('save delegates to repository', () async {
      final theme = AppThemeMother.dark();
      when(() => repository.save(theme)).thenAnswer((_) async {});

      await svc.save(theme);

      verify(() => repository.save(theme)).called(1);
    });
  });
}
