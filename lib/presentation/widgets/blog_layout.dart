import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'blog_header.dart';
import 'blog_drawer.dart';
import 'blog_footer.dart';

class BlogLayout extends StatelessWidget {
  final Widget child;
  final GoRouterState state;

  const BlogLayout({super.key, required this.child, required this.state});

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width > 800;

    return Scaffold(
      appBar: const BlogHeader(),
      drawer: isDesktop ? null : const BlogDrawer(),
      body: child,
      bottomNavigationBar: const BlogFooter(),
    );
  }
}
