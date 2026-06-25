import 'package:flutter/material.dart';
import 'package:staretz/blog/domain/entities/post.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';

class PostPreviewCard extends StatelessWidget {
  final Post post;
  final void Function(PostSlug) onTap;

  const PostPreviewCard({super.key, required this.post, required this.onTap});

  static const _author = 'Vania';

  static const _months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  String _formatDate(DateTime d) => '${_months[d.month - 1]} ${d.day}, ${d.year}';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final titleStyle = theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600);
    final metaStyle = theme.textTheme.labelSmall?.copyWith(
      color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
    );

    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(8),
      clipBehavior: Clip.hardEdge,
      child: InkWell(
        onTap: () => onTap(post.slug),
        mouseCursor: SystemMouseCursors.click,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Image.network(
                post.imageUrl.value,
                fit: BoxFit.cover,
                width: double.infinity,
                filterQuality: FilterQuality.low,
                gaplessPlayback: true,
                errorBuilder: (_, _, _) => Container(
                  color: Colors.grey.shade300,
                  child: const Icon(Icons.image, size: 48, color: Colors.grey),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    post.title.value,
                    style: titleStyle,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$_author · ${_formatDate(post.publishedAt.value)}',
                    style: metaStyle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
