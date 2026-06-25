import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:staretz_domain/shared/domain/app_theme.dart';
import 'package:staretz/shared/presentation/app_colors.dart';
import 'package:staretz/shared/presentation/widgets/theme_toggle.dart';

class Header extends StatelessWidget {
  final AppTheme currentTheme;
  final VoidCallback onToggle;
  final VoidCallback? onBack;

  const Header({
    super.key,
    required this.currentTheme,
    required this.onToggle,
    this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final logo = isDark
        ? 'assets/images/logo-black.jpg'
        : 'assets/images/logo-white.jpg';
    final mutedColor =
        Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        children: [
          if (onBack != null)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: MouseRegion(
                cursor: SystemMouseCursors.click,
                child: GestureDetector(
                  onTap: onBack,
                  child: const Icon(Icons.arrow_back, color: AppColors.magenta),
                ),
              ),
            ),
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: GestureDetector(
              onTap: () => context.go('/'),
              child: Image.asset(logo, height: 32),
            ),
          ),
          const Spacer(),
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: GestureDetector(
              onTap: () => context.go('/blog'),
              child: Text(
                'blog',
                style: TextStyle(fontSize: 14, color: mutedColor),
              ),
            ),
          ),
          const SizedBox(width: 24),
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: GestureDetector(
              onTap: () => context.go('/dashboard'),
              child: Text(
                'dashboard',
                style: TextStyle(fontSize: 14, color: mutedColor),
              ),
            ),
          ),
          const SizedBox(width: 24),
          ThemeToggle(currentTheme: currentTheme, onToggle: onToggle),
        ],
      ),
    );
  }
}
