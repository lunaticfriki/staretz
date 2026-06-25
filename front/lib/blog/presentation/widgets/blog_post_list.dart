import 'package:flutter/material.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/widgets/post_preview_card.dart';

class BlogPostList extends StatelessWidget {
  final List<Post> posts;
  final bool isLoading;
  final void Function(PostSlug) onPostTap;

  const BlogPostList({
    super.key,
    required this.posts,
    required this.isLoading,
    required this.onPostTap,
  });

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const SizedBox(
        height: 200,
        child: Center(child: CircularProgressIndicator()),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 300,
              mainAxisSpacing: 24,
              crossAxisSpacing: 24,
              childAspectRatio: 0.85,
            ),
            itemCount: posts.length,
            itemBuilder: (_, i) => PostPreviewCard(
              post: posts[i],
              onTap: onPostTap,
            ),
          ),
        ),
      ),
    );
  }
}
