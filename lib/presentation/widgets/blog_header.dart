import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../application/cubit/theme_cubit.dart';
import '../../application/cubit/theme_state.dart';

import '../../config/constants.dart';
import 'package:pixelarticons/pixel.dart';
import 'package:go_router/go_router.dart';
import 'nav_menu.dart';

class BlogHeader extends StatelessWidget implements PreferredSizeWidget {
  const BlogHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth > 800;

        return AppBar(
          title: BlocBuilder<ThemeCubit, ThemeState>(
            builder: (context, state) {
              return InkWell(
                hoverColor: Colors.transparent,
                splashColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () => context.go('/'),
                child: Image.asset(
                  state.isDarkMode
                      ? AppConstants.logoNameBlack
                      : AppConstants.logoNameWhite,
                  height: 40,
                  fit: BoxFit.contain,
                ),
              );
            },
          ),
          centerTitle: !isDesktop,
          actions: [
            if (isDesktop) const NavMenu(),
            BlocBuilder<ThemeCubit, ThemeState>(
              builder: (context, state) {
                return IconButton(
                  icon: Icon(
                    state.isDarkMode ? Pixel.sun : Pixel.moon,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  onPressed: () => context.read<ThemeCubit>().toggleTheme(),
                );
              },
            ),
            const SizedBox(width: 16),
          ],
        );
      },
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
