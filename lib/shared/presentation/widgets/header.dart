import 'package:flutter/material.dart';
import 'package:staretz/shared/domain/app_theme.dart';
import 'package:staretz/shared/presentation/widgets/theme_toggle.dart';

class Header extends StatelessWidget {
  final AppTheme currentTheme;
  final VoidCallback onToggle;

  const Header({super.key, required this.currentTheme, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final logo = isDark
        ? 'assets/images/logo-black.jpg'
        : 'assets/images/logo-white.jpg';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        children: [
          Image.asset(logo, height: 32),
          const Spacer(),
          ThemeToggle(currentTheme: currentTheme, onToggle: onToggle),
        ],
      ),
    );
  }
}
