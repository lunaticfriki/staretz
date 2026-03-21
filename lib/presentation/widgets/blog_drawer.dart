import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/constants.dart';
import '../../config/translations.dart';

class BlogDrawer extends StatelessWidget {
  const BlogDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final String currentRoute = GoRouterState.of(context).uri.toString();

    final List<Map<String, String>> menuItems = [
      {'label': AppTranslations.menuHome, 'path': '/'},
      {'label': AppTranslations.menuMusic, 'path': '/tag/music'},
      {'label': AppTranslations.menuVideogames, 'path': '/tag/videogames'},
      {'label': AppTranslations.menuPhilosophy, 'path': '/tag/philosophy'},
      {'label': AppTranslations.menuProgramming, 'path': '/tag/programming'},
      {'label': AppTranslations.menuJapan, 'path': '/tag/japan'},
      {'label': AppTranslations.menuAbout, 'path': '/about'},
    ];

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: theme.colorScheme.surface),
            child: Center(
              child: Image.asset(
                theme.brightness == Brightness.dark
                    ? AppConstants.logoNameBlack
                    : AppConstants.logoNameWhite,
                height: 40,
                fit: BoxFit.contain,
              ),
            ),
          ),
          ...menuItems.map((item) {
            final isActive = currentRoute == item['path'];
            return ListTile(
              title: Text(
                item['label']!,
                style: TextStyle(
                  color: isActive
                      ? theme.colorScheme.primary
                      : theme.textTheme.bodyMedium?.color,
                  fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                ),
              ),
              selected: isActive,
              onTap: () {
                Navigator.pop(context);
                context.go(item['path']!);
              },
            );
          }),
        ],
      ),
    );
  }
}
