import 'package:flutter/material.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/widgets/post_preview_card.dart';

const _mobileBreakpoint = 640.0;

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

    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 1200),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final isMobile = constraints.maxWidth < _mobileBreakpoint;
              return isMobile ? _SingleColumn(posts: posts, onPostTap: onPostTap) : _TwoColumnGrid(posts: posts, onPostTap: onPostTap);
            },
          ),
        ),
      ),
    );
  }
}

class _SingleColumn extends StatelessWidget {
  final List<Post> posts;
  final void Function(PostSlug) onPostTap;

  const _SingleColumn({required this.posts, required this.onPostTap});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (int i = 0; i < posts.length; i++) ...[
          if (i > 0) const SizedBox(height: 16),
          PostPreviewCard(post: posts[i], onTap: onPostTap),
        ],
      ],
    );
  }
}

class _TwoColumnGrid extends StatelessWidget {
  final List<Post> posts;
  final void Function(PostSlug) onPostTap;

  const _TwoColumnGrid({required this.posts, required this.onPostTap});

  @override
  Widget build(BuildContext context) {
    final rows = <Widget>[];
    for (int i = 0; i < posts.length; i += 2) {
      if (rows.isNotEmpty) rows.add(const SizedBox(height: 16));
      rows.add(Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(child: PostPreviewCard(post: posts[i], onTap: onPostTap)),
          const SizedBox(width: 16),
          Expanded(
            child: i + 1 < posts.length
                ? PostPreviewCard(post: posts[i + 1], onTap: onPostTap)
                : const SizedBox.shrink(),
          ),
        ],
      ));
    }
    return Column(children: rows);
  }
}
