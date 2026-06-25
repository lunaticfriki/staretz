import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:get_it/get_it.dart';
import 'package:staretz/blog/application/post.state_service.dart';
import 'package:staretz/blog/application/post_state.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/widgets/post_detail_view.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz/shared/presentation/widgets/header.dart';

class PostDetailContainer extends StatelessWidget {
  final PostSlug slug;

  const PostDetailContainer({super.key, required this.slug});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => GetIt.instance<PostStateService>()..loadBySlug(slug),
      child: BlocBuilder<PostStateService, PostState>(
        builder: (context, postState) {
          if (postState.status == PostStatus.loading) {
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }
          if (postState.selectedPost == null) {
            return const Scaffold(body: Center(child: Text('Post not found')));
          }

          return BlocBuilder<ThemeStateService, ThemeState>(
            builder: (context, themeState) => Scaffold(
              body: Stack(
                children: [
                  PostDetailView(post: postState.selectedPost!),
                  Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    child: ColoredBox(
                      color: Theme.of(context).colorScheme.surface,
                      child: Header(
                        currentTheme: themeState.theme,
                        onToggle: () =>
                            context.read<ThemeStateService>().toggle(),
                        onBack: () => context.canPop()
                            ? context.pop()
                            : context.go('/blog'),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
