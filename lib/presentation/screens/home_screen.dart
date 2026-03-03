import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../application/cubit/post_cubit.dart';
import '../../application/cubit/post_state.dart';
import '../../core/di/injection.dart';
import '../widgets/blog_header.dart';
import '../widgets/blog_footer.dart';
import '../widgets/post_list_item.dart';
import '../widgets/blog_drawer.dart';

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
    final isDesktop = MediaQuery.of(context).size.width > 800;

    return BlocProvider.value(
      value: _postCubit,
      child: Scaffold(
        appBar: const BlogHeader(),
        drawer: isDesktop ? null : const BlogDrawer(),
        body: const HomeContent(),
        bottomNavigationBar: const BlogFooter(),
      ),
    );
  }
}

class HomeContent extends StatelessWidget {
  const HomeContent({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PostCubit, PostState>(
      builder: (context, state) {
        if (state is PostLoading || state is PostInitial) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is PostError) {
          return Center(
            child: Text('${AppTranslations.errorPrefix}${state.message}'),
          );
        } else if (state is PostLoaded) {
          return Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 800),
              child: ListView.builder(
                padding: const EdgeInsets.all(16.0),
                itemCount: state.posts.length,
                itemBuilder: (context, index) {
                  final post = state.posts[index];
                  return PostListItem(post: post);
                },
              ),
            ),
          );
        }
        return const Center(child: Text(AppTranslations.unknownState));
      },
    );
  }
}
