import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:staretz/shared/application/theme.read_service.dart';
import 'package:staretz_domain/shared/domain/theme_repository.dart';
import '../../mothers/shared/app_theme_mother.dart';

class MockThemeRepository extends Mock implements ThemeRepository {}

void main() {
  late MockThemeRepository repository;
  late ThemeReadService svc;

  setUp(() {
    repository = MockThemeRepository();
    svc = ThemeReadService(repository);
  });

  group('ThemeReadService', () {
    test('getSaved returns value from repository', () async {
      final theme = AppThemeMother.dark();
      when(() => repository.load()).thenAnswer((_) async => theme);

      expect(await svc.getSaved(), theme);
      verify(() => repository.load()).called(1);
    });

    test('getSaved returns null when repository has nothing', () async {
      when(() => repository.load()).thenAnswer((_) async => null);

      expect(await svc.getSaved(), isNull);
    });
  });
}
