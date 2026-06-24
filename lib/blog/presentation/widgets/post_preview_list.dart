import 'package:flutter/material.dart';
import 'package:staretz/blog/domain/entities/post.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/widgets/post_preview_card.dart';

class PostPreviewList extends StatelessWidget {
  final List<Post> posts;
  final void Function(PostSlug) onPostTap;

  const PostPreviewList({
    super.key,
    required this.posts,
    required this.onPostTap,
  });

  @override
  Widget build(BuildContext context) {
    if (posts.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      child: GridView.builder(
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
    );
  }
}
