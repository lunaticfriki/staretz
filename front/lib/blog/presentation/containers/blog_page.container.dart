import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:get_it/get_it.dart';
import 'package:staretz/blog/application/post.state_service.dart';
import 'package:staretz/blog/application/post_state.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/widgets/blog_post_list.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz/shared/pagination/widgets/pagination_bar.dart';
import 'package:staretz/shared/presentation/widgets/footer.dart';
import 'package:staretz/shared/presentation/widgets/header.dart';

class BlogPageContainer extends StatelessWidget {
  const BlogPageContainer({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => GetIt.instance<PostStateService>()
        ..loadPage(const PageCriteria(page: 1, pageSize: 5)),
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
            body: LayoutBuilder(
              builder: (context, constraints) => SingleChildScrollView(
                child: ConstrainedBox(
                  constraints:
                      BoxConstraints(minHeight: constraints.maxHeight),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Header(
                            currentTheme: themeState.theme,
                            onToggle: () =>
                                context.read<ThemeStateService>().toggle(),
                          ),
                          BlogPostList(
                            posts: postState.posts,
                            isLoading: postState.status == PostStatus.loading,
                            isError: postState.status == PostStatus.error,
                            onPostTap: (PostSlug slug) =>
                                _openDetail(context, slug),
                          ),
                        ],
                      ),
                      Column(
                        children: [
                          PaginationBar(
                            currentPage: postState.criteria.page,
                            totalPages: totalPages,
                            hasPrevious: postState.criteria.page > 1,
                            hasNext: postState.criteria.page < totalPages,
                            onPrevious: () =>
                                svc.loadPage(postState.criteria.previous()),
                            onNext: () =>
                                svc.loadPage(postState.criteria.next()),
                          ),
                          const Footer(),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  void _openDetail(BuildContext context, PostSlug slug) {
    context.push('/blog/${slug.value}');
  }
}
