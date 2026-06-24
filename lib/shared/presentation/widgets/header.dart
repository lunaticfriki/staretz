import 'package:flutter/material.dart';
import 'package:staretz/shared/domain/app_theme.dart';
import 'package:staretz/shared/presentation/app_colors.dart';
import 'package:staretz/shared/presentation/widgets/theme_toggle.dart';

class Header extends StatelessWidget {
  final AppTheme currentTheme;
  final VoidCallback onToggle;
  final VoidCallback? onBlogTap;
  final VoidCallback? onBack;

  final VoidCallback? onHomeTap;

  const Header({
    super.key,
    required this.currentTheme,
    required this.onToggle,
    this.onHomeTap,
    this.onBlogTap,
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
            cursor: onHomeTap != null
                ? SystemMouseCursors.click
                : MouseCursor.defer,
            child: GestureDetector(
              onTap: onHomeTap,
              child: Image.asset(logo, height: 32),
            ),
          ),
          const Spacer(),
          if (onBlogTap != null)
            MouseRegion(
              cursor: SystemMouseCursors.click,
              child: GestureDetector(
                onTap: onBlogTap,
                child: Text(
                  'blog',
                  style: TextStyle(fontSize: 14, color: mutedColor),
                ),
              ),
            ),
          if (onBlogTap != null) const SizedBox(width: 24),
          ThemeToggle(currentTheme: currentTheme, onToggle: onToggle),
        ],
      ),
    );
  }
}
