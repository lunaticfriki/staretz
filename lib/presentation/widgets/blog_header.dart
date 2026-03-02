import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../application/cubit/theme_cubit.dart';
import '../../application/cubit/theme_state.dart';

class BlogHeader extends StatelessWidget implements PreferredSizeWidget {
  const BlogHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: const Text('staretz'),
      centerTitle: true,
      actions: [
        BlocBuilder<ThemeCubit, ThemeState>(
          builder: (context, state) {
            return IconButton(
              icon: Icon(
                state.isDarkMode ? Icons.light_mode : Icons.dark_mode,
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
