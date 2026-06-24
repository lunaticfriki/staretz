import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:staretz/blog/application/post.state_service.dart';
import 'package:staretz/blog/application/post_state.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/containers/post_detail.container.dart';
import 'package:staretz/blog/presentation/widgets/blog_post_list.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz/shared/pagination/page_criteria.dart';
import 'package:staretz/shared/pagination/widgets/pagination_bar.dart';
import 'package:staretz/shared/presentation/widgets/footer.dart';
import 'package:staretz/shared/presentation/widgets/header.dart';

class BlogPageContainer extends StatelessWidget {
  const BlogPageContainer({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => GetIt.instance<PostStateService>()
        ..loadPage(const PageCriteria(page: 1, pageSize: 20)),
      child: const _BlogLayout(),
    );
  }
}

class _BlogLayout extends StatelessWidget {
  const _BlogLayout();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeStateService, ThemeState>(
      builder: (context, themeState) =>
          BlocBuilder<PostStateService, PostState>(
        builder: (context, postState) {
          final svc = context.read<PostStateService>();
          final totalPages = postState.totalCount == 0
              ? 1
              : (postState.totalCount / postState.criteria.pageSize).ceil();

          return Scaffold(
            body: Column(
              children: [
                Header(
                  currentTheme: themeState.theme,
                  onToggle: () =>
                      context.read<ThemeStateService>().toggle(),
                  onHomeTap: () => Navigator.of(context).pop(),
                ),
                Expanded(
                  child: BlogPostList(
                    posts: postState.posts,
                    isLoading: postState.status == PostStatus.loading,
                    onPostTap: (PostSlug slug) => _openDetail(context, slug),
                  ),
                ),
                PaginationBar(
                  currentPage: postState.criteria.page,
                  totalPages: totalPages,
                  hasPrevious: postState.criteria.page > 1,
                  hasNext: postState.criteria.page < totalPages,
                  onPrevious: () =>
                      svc.loadPage(postState.criteria.previous()),
                  onNext: () => svc.loadPage(postState.criteria.next()),
                ),
                const Footer(),
              ],
            ),
          );
        },
      ),
    );
  }

  void _openDetail(BuildContext context, PostSlug slug) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => PostDetailContainer(slug: slug)),
    );
  }
}
