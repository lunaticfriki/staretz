import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:staretz_domain/shared/domain/app_theme.dart';
import 'package:staretz/shared/presentation/app_colors.dart';
import 'package:staretz/shared/presentation/widgets/app_logo.dart';
import 'package:staretz/shared/presentation/widgets/theme_toggle.dart';

const _mobileBreakpoint = 640.0;

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
    final isMobile = MediaQuery.sizeOf(context).width < _mobileBreakpoint;
    final mutedColor =
        Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6);
    final location = GoRouterState.of(context).uri.path;

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
              child: const AppLogo(),
            ),
          ),
          const Spacer(),
          if (isMobile)
            MouseRegion(
              cursor: SystemMouseCursors.click,
              child: GestureDetector(
                onTap: () => _openMenu(context, location),
                child: Icon(Icons.menu, color: mutedColor),
              ),
            )
          else ...[
            _NavLink(
              label: 'blog',
              isActive: location.startsWith('/blog'),
              onTap: () => context.go('/blog'),
            ),
            const SizedBox(width: 24),
            _NavLink(
              label: 'dashboard',
              isActive: location.startsWith('/dashboard'),
              onTap: () => context.go('/dashboard'),
            ),
            const SizedBox(width: 24),
            ThemeToggle(currentTheme: currentTheme, onToggle: onToggle),
          ],
        ],
      ),
    );
  }

  void _openMenu(BuildContext context, String location) {
    final router = GoRouter.of(context);
    showGeneralDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'close menu',
      barrierColor: Colors.transparent,
      transitionDuration: const Duration(milliseconds: 200),
      pageBuilder: (ctx, _, _) => _MobileMenu(
        router: router,
        currentTheme: currentTheme,
        onToggle: onToggle,
        location: location,
      ),
      transitionBuilder: (ctx, anim, _, child) => FadeTransition(
        opacity: CurvedAnimation(parent: anim, curve: Curves.easeOut),
        child: child,
      ),
    );
  }
}

class _NavLink extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavLink({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: onTap,
        child: Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: isActive
                ? AppColors.magenta
                : Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
          ),
        ),
      ),
    );
  }
}

class _MobileMenu extends StatelessWidget {
  final GoRouter router;
  final AppTheme currentTheme;
  final VoidCallback onToggle;
  final String location;

  const _MobileMenu({
    required this.router,
    required this.currentTheme,
    required this.onToggle,
    required this.location,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Align(
                alignment: Alignment.topRight,
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Icon(
                      Icons.close,
                      color: Theme.of(context)
                          .colorScheme
                          .onSurface
                          .withValues(alpha: 0.6),
                    ),
                  ),
                ),
              ),
            ),
            const Spacer(),
            _MobileMenuItem(
              label: 'blog',
              isActive: location.startsWith('/blog'),
              onTap: () {
                Navigator.of(context).pop();
                router.go('/blog');
              },
            ),
            const SizedBox(height: 32),
            _MobileMenuItem(
              label: 'dashboard',
              isActive: location.startsWith('/dashboard'),
              onTap: () {
                Navigator.of(context).pop();
                router.go('/dashboard');
              },
            ),
            const Spacer(),
            Center(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 40),
                child: ThemeToggle(currentTheme: currentTheme, onToggle: onToggle),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MobileMenuItem extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _MobileMenuItem({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: onTap,
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 32,
              color: isActive
                  ? AppColors.magenta
                  : Theme.of(context)
                      .colorScheme
                      .onSurface
                      .withValues(alpha: 0.6),
            ),
          ),
        ),
      ),
    );
  }
}
