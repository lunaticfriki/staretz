import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:staretz/dashboard/application/post_edit.state_service.dart';
import 'package:staretz/dashboard/application/post_edit_state.dart';
import 'package:staretz/dashboard/presentation/widgets/post_list.dart';
import 'package:staretz/shared/pagination/widgets/pagination_bar.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';

class PostListContainer extends StatefulWidget {
  const PostListContainer({super.key});

  @override
  State<PostListContainer> createState() => _PostListContainerState();
}

class _PostListContainerState extends State<PostListContainer> {
  @override
  void initState() {
    super.initState();
    GetIt.instance<PostEditStateService>()
        .loadPage(const PageCriteria(page: 1, pageSize: 10));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PostEditStateService, PostEditState>(
      builder: (context, state) {
        if (state.status == PostEditStatus.loading) {
          return const Center(child: CircularProgressIndicator());
        }
        if (state.status == PostEditStatus.error) {
          return const Center(
            child: Text('Could not connect to the backend.'),
          );
        }
        final totalPages = state.totalCount == 0
            ? 1
            : (state.totalCount / state.criteria.pageSize).ceil();
        return Column(
          children: [
            Expanded(
              child: PostList(
                posts: state.posts,
                onEdit: (post) {
                  context.read<PostEditStateService>().startEditing(post);
                  context.go('/dashboard/${post.slug.value}/edit');
                },
                onDelete: (post) =>
                    context.read<PostEditStateService>().deletePost(post.slug),
              ),
            ),
            PaginationBar(
              currentPage: state.criteria.page,
              totalPages: totalPages,
              hasPrevious: state.criteria.page > 1,
              hasNext: state.criteria.page < totalPages,
              onPrevious: () => context
                  .read<PostEditStateService>()
                  .loadPage(state.criteria.previous()),
              onNext: () => context
                  .read<PostEditStateService>()
                  .loadPage(state.criteria.next()),
            ),
          ],
        );
      },
    );
  }
}
