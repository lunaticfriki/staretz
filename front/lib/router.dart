import 'package:go_router/go_router.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/containers/blog_page.container.dart';
import 'package:staretz/dashboard/presentation/containers/post_editor.container.dart';
import 'package:staretz/dashboard/presentation/containers/post_list.container.dart';
import 'package:staretz/blog/presentation/containers/post_detail.container.dart';
import 'package:staretz/shared/presentation/containers/home.dart';

final appRouter = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (_, _) => const HomePage(),
    ),
    GoRoute(
      path: '/blog',
      builder: (_, _) => const BlogPageContainer(),
      routes: [
        GoRoute(
          path: ':slug',
          builder: (_, state) => PostDetailContainer(
            slug: PostSlug.create(state.pathParameters['slug']!),
          ),
        ),
      ],
    ),
    GoRoute(
      path: '/dashboard',
      builder: (_, _) => const PostListContainer(),
      routes: [
        GoRoute(
          path: 'new',
          builder: (_, _) => const PostEditorContainer(),
        ),
        GoRoute(
          path: ':slug/edit',
          builder: (_, _) => const PostEditorContainer(),
        ),
      ],
    ),
  ],
);
