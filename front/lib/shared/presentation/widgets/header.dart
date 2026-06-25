import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:staretz_domain/shared/domain/app_theme.dart';
import 'package:staretz/shared/presentation/app_colors.dart';
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
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final logo = isDark
        ? 'assets/images/logo-black.jpg'
        : 'assets/images/logo-white.jpg';
    final isMobile = MediaQuery.sizeOf(context).width < _mobileBreakpoint;
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
          if (isMobile)
            MouseRegion(
              cursor: SystemMouseCursors.click,
              child: GestureDetector(
                onTap: () => _openMenu(context),
                child: Icon(Icons.menu, color: mutedColor),
              ),
            )
          else ...[
            _NavLink(label: 'blog', onTap: () => context.go('/blog')),
            const SizedBox(width: 24),
            _NavLink(label: 'dashboard', onTap: () => context.go('/dashboard')),
            const SizedBox(width: 24),
            ThemeToggle(currentTheme: currentTheme, onToggle: onToggle),
          ],
        ],
      ),
    );
  }

  void _openMenu(BuildContext context) {
    final router = GoRouter.of(context);
    showGeneralDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'close menu',
      barrierColor: Colors.transparent,
      transitionDuration: const Duration(milliseconds: 200),
      pageBuilder: (ctx, _, __) => _MobileMenu(
        router: router,
        currentTheme: currentTheme,
        onToggle: onToggle,
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
  final VoidCallback onTap;

  const _NavLink({required this.label, required this.onTap});

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
            color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
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

  const _MobileMenu({
    required this.router,
    required this.currentTheme,
    required this.onToggle,
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
              onTap: () {
                Navigator.of(context).pop();
                router.go('/blog');
              },
            ),
            const SizedBox(height: 32),
            _MobileMenuItem(
              label: 'dashboard',
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
  final VoidCallback onTap;

  const _MobileMenuItem({required this.label, required this.onTap});

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
              color: Theme.of(context)
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
