import 'package:flutter/material.dart';
import 'package:staretz_domain/shared/domain/app_theme.dart';

extension AppThemeFlutter on AppTheme {
  ThemeMode get flutterThemeMode => switch (value) {
        AppThemeValue.light => ThemeMode.light,
        AppThemeValue.dark => ThemeMode.dark,
        AppThemeValue.system => ThemeMode.system,
      };
}
