import 'package:shared_preferences/shared_preferences.dart';
import 'package:staretz_domain/shared/domain/app_theme.dart';
import 'package:staretz_domain/shared/domain/theme_repository.dart';

class LocalStorageThemeRepository implements ThemeRepository {
  static const _key = 'theme';

  @override
  Future<AppTheme?> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    return raw == null ? null : AppTheme.fromString(raw);
  }

  @override
  Future<void> save(AppTheme theme) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, theme.toStorageKey());
  }
}
