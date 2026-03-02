import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../application/cubit/post_cubit.dart';
import '../../application/cubit/post_state.dart';
import '../../core/di/injection.dart';
import '../widgets/blog_header.dart';
import '../widgets/blog_footer.dart';
import '../widgets/post_list_item.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<PostCubit>(),
      child: Scaffold(
        appBar: const BlogHeader(),
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
          return Center(child: Text('Error: ${state.message}'));
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
        return const Center(child: Text('Unknown State'));
      },
    );
  }
}
