import 'package:flutter/material.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';

class PostList extends StatelessWidget {
  final List<Post> posts;
  final void Function(Post) onEdit;
  final void Function(Post) onDelete;

  const PostList({
    super.key,
    required this.posts,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    if (posts.isEmpty) {
      return const Center(child: Text('No posts yet.'));
    }
    return ListView.separated(
      padding: const EdgeInsets.all(24),
      itemCount: posts.length,
      separatorBuilder: (_, i) => const Divider(),
      itemBuilder: (_, i) {
        final post = posts[i];
        return ListTile(
          title: Text(post.title.value),
          subtitle: Text(
            post.publishedAt.value.toIso8601String().split('T').first,
          ),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                icon: const Icon(Icons.edit),
                onPressed: () => onEdit(post),
              ),
              IconButton(
                icon: const Icon(Icons.delete),
                onPressed: () => _confirmDelete(context, post),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _confirmDelete(BuildContext context, Post post) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete post'),
        content: Text('Delete "${post.title.value}"? This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed == true) onDelete(post);
  }
}
