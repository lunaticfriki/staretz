import 'package:flutter/material.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/widgets/post_preview_card.dart';

class BlogPostList extends StatelessWidget {
  final List<Post> posts;
  final bool isLoading;
  final bool isError;
  final void Function(PostSlug) onPostTap;

  const BlogPostList({
    super.key,
    required this.posts,
    required this.isLoading,
    required this.isError,
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
    if (isError) {
      return const SizedBox(
        height: 200,
        child: Center(child: Text('could not connect to the backend.')),
      );
    }

    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 1100),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: posts.length,
            separatorBuilder: (_, _) => const SizedBox(height: 16),
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
