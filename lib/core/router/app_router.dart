import 'package:go_router/go_router.dart';

import '../../domain/entities/post.dart';
import '../../presentation/screens/home_screen.dart';
import '../../presentation/screens/about_screen.dart';
import '../../presentation/screens/post_screen.dart';
import '../../presentation/widgets/blog_layout.dart';
import 'app_route.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: AppRouterBuilder.buildCustomRoutes([
    ShellAppRoute(
      builder: (context, state, child) =>
          BlogLayout(state: state, child: child),
      children: [
        LeafRoute(path: '/', builder: (context, state) => const HomeScreen()),
        LeafRoute(
          path: '/tag/:tag',
          builder: (context, state) {
            final tag = state.pathParameters['tag'];
            return HomeScreen(tag: tag);
          },
        ),
        LeafRoute(
          path: '/about',
          builder: (context, state) => const AboutScreen(),
        ),
        LeafRoute(
          path: '/post/:id',
          builder: (context, state) {
            final post = state.extra as Post;
            return PostScreen(post: post);
          },
        ),
      ],
    ),
  ]),
);
