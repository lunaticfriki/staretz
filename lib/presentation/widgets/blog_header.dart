import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../application/cubit/theme_cubit.dart';
import '../../application/cubit/theme_state.dart';

import '../../config/constants.dart';
import 'package:pixelarticons/pixel.dart';

class BlogHeader extends StatelessWidget implements PreferredSizeWidget {
  const BlogHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: BlocBuilder<ThemeCubit, ThemeState>(
        builder: (context, state) {
          return Image.asset(
            state.isDarkMode
                ? AppConstants.logoNameBlack
                : AppConstants.logoNameWhite,
            height: 40,
            fit: BoxFit.contain,
          );
        },
      ),
      centerTitle: true,
      actions: [
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
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
