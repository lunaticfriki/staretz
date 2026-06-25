import 'package:staretz_domain/shared/domain/app_theme.dart';

abstract class ThemeRepository {
  Future<AppTheme?> load();
  Future<void> save(AppTheme theme);
}
