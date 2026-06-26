import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:staretz/blog/application/post.state_service.dart';
import 'package:staretz/blog/application/post_state.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/blog/presentation/widgets/post_preview_list.dart';

class HomePreviewContainer extends StatelessWidget {
  const HomePreviewContainer({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => GetIt.instance<PostStateService>()..loadPreview(6),
      child: BlocBuilder<PostStateService, PostState>(
        builder: (context, state) => switch (state.status) {
          PostStatus.loading =>
            const Center(child: CircularProgressIndicator()),
          PostStatus.loaded => PostPreviewList(
              posts: state.posts,
              onPostTap: (PostSlug slug) => _openDetail(context, slug),
            ),
          PostStatus.error => const Center(
              child: Text('could not connect to the backend.'),
            ),
          _ => const SizedBox.shrink(),
        },
      ),
    );
  }

  void _openDetail(BuildContext context, PostSlug slug) {
    context.push('/blog/${slug.value}');
  }
}
