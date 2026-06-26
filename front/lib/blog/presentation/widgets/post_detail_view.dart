import 'package:flutter/material.dart';
import 'package:staretz/shared/presentation/app_colors.dart';
import 'package:staretz/shared/presentation/widgets/external_image.dart';
import 'package:staretz/shared/presentation/widgets/footer.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';

class PostDetailView extends StatelessWidget {
  final Post post;

  const PostDetailView({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Hero(post: post),
          _Body(post: post),
          const Footer(),
        ],
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  final Post post;

  const _Hero({required this.post});

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: SizedBox(
        height: MediaQuery.of(context).size.height,
        child: Stack(
          fit: StackFit.expand,
          children: [
            ExternalImage(src: post.imageUrl.value),
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.75),
                  ],
                ),
              ),
            ),
            Positioned(
              bottom: 48,
              left: 32,
              right: 32,
              child: Text(
                post.title.value.toUpperCase(),
                style: TextStyle(
                  fontSize: 60,
                  fontWeight: FontWeight.bold,
                  color: Colors.white.withValues(alpha: 0.9),
                  height: 1.25,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Body extends StatelessWidget {
  final Post post;

  const _Body({required this.post});

  @override
  Widget build(BuildContext context) {
    final date = post.publishedAt.value;
    final formatted =
        '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';

    return Padding(
      padding: const EdgeInsets.only(top: 48, bottom: 80, left: 32, right: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            formatted,
            style: const TextStyle(
              color: AppColors.magenta,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 32),
          Text(
            post.body.value,
            style: const TextStyle(fontSize: 16, height: 1.75),
          ),
        ],
      ),
    );
  }
}
