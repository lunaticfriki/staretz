import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';

abstract class AppRoute {
  RouteBase buildGoRoute();
}

class LeafRoute implements AppRoute {
  final String path;
  final Widget Function(BuildContext, GoRouterState) builder;

  LeafRoute({required this.path, required this.builder});

  @override
  RouteBase buildGoRoute() {
    return GoRoute(path: path, builder: builder);
  }
}

class ShellAppRoute implements AppRoute {
  final Widget Function(BuildContext, GoRouterState, Widget) builder;
  final List<AppRoute> children;

  ShellAppRoute({required this.builder, required this.children});

  @override
  RouteBase buildGoRoute() {
    return ShellRoute(
      builder: builder,
      routes: children.map((child) => child.buildGoRoute()).toList(),
    );
  }
}

class CompositeRoute implements AppRoute {
  final String path;
  final Widget Function(BuildContext, GoRouterState)? builder;
  final List<AppRoute> children;

  CompositeRoute({required this.path, this.builder, required this.children});

  @override
  RouteBase buildGoRoute() {
    return GoRoute(
      path: path,
      builder: builder,
      routes: children.map((child) => child.buildGoRoute()).toList(),
    );
  }
}

class AppRouterBuilder {
  static List<RouteBase> buildCustomRoutes(List<AppRoute> routes) {
    return routes.map((route) => route.buildGoRoute()).toList();
  }
}
