import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../application/cubit/post_cubit.dart';
import '../../application/cubit/post_state.dart';
import '../../core/di/injection.dart';
import '../widgets/post_list_item.dart';

import '../../config/translations.dart';

class HomeScreen extends StatefulWidget {
  final String? tag;
  const HomeScreen({super.key, this.tag});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final PostCubit _postCubit;

  @override
  void initState() {
    super.initState();
    _postCubit = getIt<PostCubit>()..loadPosts(tag: widget.tag);
  }

  @override
  void didUpdateWidget(covariant HomeScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.tag != widget.tag) {
      _postCubit.loadPosts(tag: widget.tag);
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(value: _postCubit, child: const HomeContent());
  }
}

class HomeContent extends StatelessWidget {
  const HomeContent({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PostCubit, PostState>(
      builder: (context, state) {
        return switch (state) {
          PostInitial() ||
          PostLoading() => const Center(child: CircularProgressIndicator()),
          PostError(message: final msg) => Center(
            child: Text('${AppTranslations.errorPrefix}$msg'),
          ),
          PostLoaded(posts: final posts) when posts.isEmpty => Center(
            child: Text(
              AppTranslations.comingSoon,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          PostLoaded(posts: final posts) => ListView.builder(
            padding: const EdgeInsets.only(
              left: 16.0,
              right: 16.0,
              top: 48.0,
              bottom: 16.0,
            ),
            itemCount: posts.length,
            itemBuilder: (context, index) {
              final post = posts[index];
              return Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 800),
                  child: PostListItem(post: post),
                ),
              );
            },
          ),
          _ => const Center(child: Text(AppTranslations.unknownState)),
        };
      },
    );
  }
}
