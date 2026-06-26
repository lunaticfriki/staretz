import 'package:flutter/material.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';

class PostPreviewCard extends StatelessWidget {
  final Post post;
  final void Function(PostSlug) onTap;

  const PostPreviewCard({super.key, required this.post, required this.onTap});

  static const _author = 'Vania';
  static const _mobileBreakpoint = 640.0;
  static const _mobileImageHeight = 200.0;
  static const _desktopCardHeight = 180.0;
  static const _desktopImageWidth = 260.0;

  static const _months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  String _formatDate(DateTime d) => '${_months[d.month - 1]} ${d.day}, ${d.year}';

  Widget _buildImage() {
    return Image.network(
      post.imageUrl.value,
      fit: BoxFit.cover,
      width: double.infinity,
      height: double.infinity,
      filterQuality: FilterQuality.low,
      gaplessPlayback: true,
      errorBuilder: (_, _, _) => Container(
        color: Colors.grey.shade300,
        child: const Icon(Icons.image, size: 48, color: Colors.grey),
      ),
    );
  }

  Widget _buildInfo(TextStyle? titleStyle, TextStyle? metaStyle, {int maxTitleLines = 2, EdgeInsets padding = const EdgeInsets.all(12)}) {
    return Padding(
      padding: padding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            post.title.value,
            style: titleStyle,
            maxLines: maxTitleLines,
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
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final titleStyle = theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600);
    final metaStyle = theme.textTheme.labelSmall?.copyWith(
      color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
    );
    final isMobile = MediaQuery.sizeOf(context).width < _mobileBreakpoint;

    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(8),
      clipBehavior: Clip.hardEdge,
      child: InkWell(
        onTap: () => onTap(post.slug),
        mouseCursor: SystemMouseCursors.click,
        child: isMobile
            ? Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    height: _mobileImageHeight,
                    width: double.infinity,
                    child: _buildImage(),
                  ),
                  _buildInfo(titleStyle, metaStyle),
                ],
              )
            : SizedBox(
                height: _desktopCardHeight,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    SizedBox(
                      width: _desktopImageWidth,
                      child: _buildImage(),
                    ),
                    Expanded(
                      child: _buildInfo(
                        titleStyle,
                        metaStyle,
                        maxTitleLines: 3,
                        padding: const EdgeInsets.all(16),
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}
