import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:staretz/shared/application/theme.read_service.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme.write_service.dart';
import 'package:staretz/shared/domain/app_theme.dart';
import 'package:staretz/shared/domain/theme_repository.dart';
import '../../mothers/shared/app_theme_mother.dart';

class MockThemeRepository extends Mock implements ThemeRepository {}

void main() {
  late MockThemeRepository repository;
  late ThemeReadService readSvc;
  late ThemeWriteService writeSvc;
  late ThemeStateService cubit;

  setUp(() {
    repository = MockThemeRepository();
    readSvc = ThemeReadService(repository);
    writeSvc = ThemeWriteService(repository);
    cubit = ThemeStateService(readSvc, writeSvc);
    registerFallbackValue(AppTheme.system);
  });

  tearDown(() => cubit.close());

  group('ThemeStateService', () {
    test('initial state is system', () {
      expect(cubit.state.theme, AppThemeMother.system());
    });

    test('load applies saved theme', () async {
      when(() => repository.load()).thenAnswer((_) async => AppThemeMother.dark());

      await cubit.load();

      expect(cubit.state.theme, AppThemeMother.dark());
    });

    test('load keeps system when nothing is saved', () async {
      when(() => repository.load()).thenAnswer((_) async => null);

      await cubit.load();

      expect(cubit.state.theme, AppThemeMother.system());
    });

    test('toggle cycles through themes and persists', () async {
      when(() => repository.save(any())).thenAnswer((_) async {});

      await cubit.toggle();
      expect(cubit.state.theme, AppThemeMother.light());

      await cubit.toggle();
      expect(cubit.state.theme, AppThemeMother.dark());

      await cubit.toggle();
      expect(cubit.state.theme, AppThemeMother.system());

      verify(() => repository.save(any())).called(3);
    });
  });
}
