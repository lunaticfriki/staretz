import 'package:staretz_domain/shared/domain/app_theme.dart';

class ThemeState {
  final AppTheme theme;

  const ThemeState({required this.theme});

  factory ThemeState.initial() => const ThemeState(theme: AppTheme.system);

  ThemeState copyWith({AppTheme? theme}) =>
      ThemeState(theme: theme ?? this.theme);
}
