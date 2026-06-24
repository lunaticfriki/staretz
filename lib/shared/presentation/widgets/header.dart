import 'package:flutter/material.dart';
import 'package:staretz/shared/domain/app_theme.dart';
import 'package:staretz/shared/presentation/widgets/theme_toggle.dart';

class Header extends StatelessWidget {
  final AppTheme currentTheme;
  final VoidCallback onToggle;

  const Header({super.key, required this.currentTheme, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        children: [
          const Text(
            'staretz',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const Spacer(),
          ThemeToggle(currentTheme: currentTheme, onToggle: onToggle),
        ],
      ),
    );
  }
}
