import 'package:rxdart/rxdart.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../domain/services/theme_service.dart';

class SharedPrefsThemeService implements ThemeService {
  final SharedPreferences _prefs;
  static const _themeKey = 'is_dark_mode';

  late final BehaviorSubject<bool> _isDarkModeSubject;

  SharedPrefsThemeService(this._prefs) {
    // Read the initial theme from shared preferences (default to false / light mode)
    final isDark = _prefs.getBool(_themeKey) ?? false;
    _isDarkModeSubject = BehaviorSubject<bool>.seeded(isDark);
  }

  @override
  Stream<bool> get isDarkMode => _isDarkModeSubject.stream;

  @override
  Future<void> toggleTheme() async {
    final newTheme = !_isDarkModeSubject.value;
    await setDarkMode(newTheme);
  }

  @override
  Future<void> setDarkMode(bool isDark) async {
    await _prefs.setBool(_themeKey, isDark);
    _isDarkModeSubject.add(isDark);
  }

  void dispose() {
    _isDarkModeSubject.close();
  }
}
