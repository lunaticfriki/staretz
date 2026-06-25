import 'package:go_router/go_router.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/containers/blog_page.container.dart';
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
  ],
);
