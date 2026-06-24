enum AppThemeValue { light, dark, system }

class AppTheme {
  final AppThemeValue value;

  const AppTheme._(this.value);

  static const light = AppTheme._(AppThemeValue.light);
  static const dark = AppTheme._(AppThemeValue.dark);
  static const system = AppTheme._(AppThemeValue.system);

  factory AppTheme.fromString(String raw) => switch (raw) {
        'light' => AppTheme.light,
        'dark' => AppTheme.dark,
        _ => AppTheme.system,
      };

  String toStorageKey() => switch (value) {
        AppThemeValue.light => 'light',
        AppThemeValue.dark => 'dark',
        AppThemeValue.system => 'system',
      };

  AppTheme get next => switch (value) {
        AppThemeValue.system => AppTheme.light,
        AppThemeValue.light => AppTheme.dark,
        AppThemeValue.dark => AppTheme.system,
      };

  @override
  bool operator ==(Object other) => other is AppTheme && other.value == value;

  @override
  int get hashCode => value.hashCode;
}
