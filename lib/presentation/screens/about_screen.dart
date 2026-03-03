import 'package:flutter/material.dart';
import '../widgets/blog_header.dart';
import '../widgets/blog_drawer.dart';
import '../widgets/blog_footer.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width > 800;

    return Scaffold(
      appBar: const BlogHeader(),
      drawer: isDesktop ? null : const BlogDrawer(),
      body: const Center(child: Text('About Page Content')),
      bottomNavigationBar: const BlogFooter(),
    );
  }
}
