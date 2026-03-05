import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../../domain/entities/post.dart';
import '../widgets/blog_header.dart';
import '../widgets/blog_footer.dart';
import '../widgets/blog_drawer.dart';

class PostScreen extends StatelessWidget {
  final Post post;

  const PostScreen({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    final heroImage =
        post.images.where((img) => img.isHero).firstOrNull ??
        post.images.firstOrNull;

    final isDesktop = MediaQuery.of(context).size.width > 800;

    return Scaffold(
      appBar: const BlogHeader(),
      drawer: isDesktop ? null : const BlogDrawer(),
      bottomNavigationBar: const BlogFooter(),
      body: CustomScrollView(
        slivers: [
          if (heroImage != null)
            SliverToBoxAdapter(
              child: Image.network(
                heroImage.url,
                width: double.infinity,
                height: MediaQuery.of(context).size.height * 0.5,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  height: MediaQuery.of(context).size.height * 0.5,
                  color: Theme.of(context).scaffoldBackgroundColor,
                  child: const Center(
                    child: Icon(
                      Icons.broken_image,
                      size: 50,
                      color: Colors.grey,
                    ),
                  ),
                ),
              ),
            ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 24.0,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    post.title.value,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.person, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(
                        post.author.value,
                        style: Theme.of(
                          context,
                        ).textTheme.bodyMedium?.copyWith(color: Colors.grey),
                      ),
                      const SizedBox(width: 16),
                      const Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: Colors.grey,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${post.createdAt.day.toString().padLeft(2, '0')}/${post.createdAt.month.toString().padLeft(2, '0')}/${post.createdAt.year}',
                        style: Theme.of(
                          context,
                        ).textTheme.bodyMedium?.copyWith(color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 800),
                      child: MarkdownBody(
                        data: post.content.value,
                        selectable: true,
                        styleSheet: MarkdownStyleSheet(
                          p: Theme.of(
                            context,
                          ).textTheme.bodyLarge?.copyWith(height: 1.6),
                          h1: Theme.of(context).textTheme.headlineMedium,
                          h2: Theme.of(context).textTheme.headlineSmall,
                          h3: Theme.of(context).textTheme.titleLarge,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 48),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
