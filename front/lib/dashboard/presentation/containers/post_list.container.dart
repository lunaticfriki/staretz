import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:staretz/dashboard/application/post_edit.state_service.dart';
import 'package:staretz/dashboard/application/post_edit_state.dart';
import 'package:staretz/dashboard/presentation/widgets/post_list.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz/shared/presentation/widgets/header.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';

class PostListContainer extends StatefulWidget {
  const PostListContainer({super.key});

  @override
  State<PostListContainer> createState() => _PostListContainerState();
}

class _PostListContainerState extends State<PostListContainer> {
  late final PostEditStateService _service;

  @override
  void initState() {
    super.initState();
    _service = GetIt.instance<PostEditStateService>();
    _service.loadPage(const PageCriteria(page: 1, pageSize: 20));
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: _service,
      child: const _ListLayout(),
    );
  }
}

class _ListLayout extends StatelessWidget {
  const _ListLayout();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeStateService, ThemeState>(
      builder: (context, themeState) => Scaffold(
        body: Column(
          children: [
            Header(
              currentTheme: themeState.theme,
              onToggle: () => context.read<ThemeStateService>().toggle(),
            ),
            Expanded(
              child: BlocBuilder<PostEditStateService, PostEditState>(
                builder: (context, state) {
                  if (state.status == PostEditStatus.loading) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (state.status == PostEditStatus.error) {
                    return const Center(
                      child: Text('Could not connect to the backend.'),
                    );
                  }
                  return Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: ElevatedButton.icon(
                          onPressed: () {
                            context
                                .read<PostEditStateService>()
                                .clearEditing();
                            context.push('/dashboard/new');
                          },
                          icon: const Icon(Icons.add),
                          label: const Text('New post'),
                        ),
                      ),
                      Expanded(
                        child: PostList(
                          posts: state.posts,
                          onEdit: (post) {
                            context
                                .read<PostEditStateService>()
                                .startEditing(post);
                            context.push('/dashboard/${post.slug.value}/edit');
                          },
                          onDelete: (post) => context
                              .read<PostEditStateService>()
                              .deletePost(post.slug),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
