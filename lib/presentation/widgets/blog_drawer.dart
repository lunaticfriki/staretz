import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/constants.dart';

class BlogDrawer extends StatelessWidget {
  const BlogDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final String currentRoute = GoRouterState.of(context).uri.toString();

    final List<Map<String, String>> menuItems = [
      {'label': 'Home', 'path': '/'},
      {'label': 'Music', 'path': '/tag/music'},
      {'label': 'Videogames', 'path': '/tag/videogames'},
      {'label': 'Philosophy', 'path': '/tag/philosophy'},
      {'label': 'Programming', 'path': '/tag/programming'},
      {'label': 'About', 'path': '/about'},
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
