import 'package:staretz_domain/shared/domain/app_theme.dart';
import 'package:test/test.dart';
import '../../mothers/shared/app_theme_mother.dart';

void main() {
  group('AppTheme', () {
    test('fromString returns light for "light"', () {
      expect(AppTheme.fromString('light'), AppThemeMother.light());
    });

    test('fromString returns dark for "dark"', () {
      expect(AppTheme.fromString('dark'), AppThemeMother.dark());
    });

    test('fromString returns system for unknown value', () {
      expect(AppTheme.fromString('unknown'), AppThemeMother.system());
    });

    test('toStorageKey round-trips correctly', () {
      for (final theme in [AppTheme.light, AppTheme.dark, AppTheme.system]) {
        expect(AppTheme.fromString(theme.toStorageKey()), theme);
      }
    });

    test('next cycles system → light → dark → system', () {
      expect(AppThemeMother.system().next, AppThemeMother.light());
      expect(AppThemeMother.light().next, AppThemeMother.dark());
      expect(AppThemeMother.dark().next, AppThemeMother.system());
    });

    test('equality is structural', () {
      expect(AppTheme.light, AppTheme.light);
      expect(AppTheme.light == AppTheme.dark, isFalse);
    });
  });
}
