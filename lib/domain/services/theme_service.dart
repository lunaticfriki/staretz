abstract class ThemeService {
  Stream<bool> get isDarkMode;
  Future<void> toggleTheme();
  Future<void> setDarkMode(bool isDark);
}
