import 'package:go_router/go_router.dart';

import '../../domain/entities/post.dart';
import '../../presentation/screens/home_screen.dart';
import '../../presentation/screens/about_screen.dart';
import '../../presentation/screens/post_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
    GoRoute(
      path: '/tag/:tag',
      builder: (context, state) {
        final tag = state.pathParameters['tag'];
        return HomeScreen(tag: tag);
      },
    ),
    GoRoute(path: '/about', builder: (context, state) => const AboutScreen()),
    GoRoute(
      path: '/post/:id',
      builder: (context, state) {
        final post = state.extra as Post;
        return PostScreen(post: post);
      },
    ),
  ],
);
