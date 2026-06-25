import 'package:flutter/material.dart';
import 'package:staretz_domain/shared/domain/app_theme.dart';
import 'package:staretz/shared/presentation/widgets/pixel_icons.dart';

class ThemeToggle extends StatelessWidget {
  final AppTheme currentTheme;
  final VoidCallback onToggle;

  const ThemeToggle({super.key, required this.currentTheme, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.onSurface;
    final label = switch (currentTheme.value) {
      AppThemeValue.light => 'light',
      AppThemeValue.dark => 'dark',
      AppThemeValue.system => 'system',
    };

    return Tooltip(
      message: label,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          onTap: onToggle,
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: switch (currentTheme.value) {
              AppThemeValue.light => PixelSunIcon(color: color),
              AppThemeValue.dark => PixelMoonIcon(color: color),
              AppThemeValue.system => PixelAutoIcon(color: color),
            },
          ),
        ),
      ),
    );
  }
}
