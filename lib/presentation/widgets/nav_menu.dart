import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/translations.dart';

class NavMenu extends StatefulWidget {
  const NavMenu({super.key});

  @override
  State<NavMenu> createState() => _NavMenuState();
}

class _NavMenuState extends State<NavMenu> {
  final List<Map<String, String>> _menuItems = [
    {'label': AppTranslations.menuMusic, 'path': '/tag/music'},
    {'label': AppTranslations.menuVideogames, 'path': '/tag/videogames'},
    {'label': AppTranslations.menuPhilosophy, 'path': '/tag/philosophy'},
    {'label': AppTranslations.menuProgramming, 'path': '/tag/programming'},
    {'label': AppTranslations.menuAbout, 'path': '/about'},
  ];

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: _menuItems.map((item) {
        return _NavItem(label: item['label']!, path: item['path']!);
      }).toList(),
    );
  }
}

class _NavItem extends StatefulWidget {
  final String label;
  final String path;

  const _NavItem({required this.label, required this.path});

  @override
  State<_NavItem> createState() => _NavItemState();
}

class _NavItemState extends State<_NavItem> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final String currentRoute = GoRouterState.of(context).uri.toString();
    final bool isActive = currentRoute == widget.path;

    Color itemColor = theme.textTheme.bodyMedium?.color ?? Colors.black;
    if (isActive) {
      itemColor = theme.colorScheme.primary;
    } else if (_isHovered) {
      itemColor = theme.colorScheme.secondary;
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: InkWell(
        hoverColor: Colors.transparent,
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        onTap: () {
          context.go(widget.path);
        },
        onHover: (hovered) {
          setState(() {
            _isHovered = hovered;
          });
        },
        child: Text(
          widget.label,
          style: theme.textTheme.titleMedium?.copyWith(
            color: itemColor,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
