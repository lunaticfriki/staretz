# Presentation Layer

## Two component types

### Dumb widget

A stateless Flutter widget that receives all its data and callbacks as constructor parameters. No Bloc, no DI, no business logic.

File suffix: no special suffix — just descriptive name (`post_list.dart`, `post_card.dart`).

```dart
class PostList extends StatelessWidget {
  final List<Post> posts;
  final void Function(PostSlug) onTap;

  const PostList({super.key, required this.posts, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: posts.length,
      itemBuilder: (_, i) => PostCard(post: posts[i], onTap: onTap),
    );
  }
}
```

### Container

Wires a Cubit (state service) to dumb widgets. Uses `BlocBuilder` or `BlocConsumer`. Contains no visual logic.

File suffix: `.container.dart`.

```dart
class PostListContainer extends StatelessWidget {
  const PostListContainer({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PostStateService, PostState>(
      builder: (context, state) => switch (state.status) {
        PostStatus.loading => const CircularProgressIndicator(),
        PostStatus.loaded => PostList(
            posts: state.posts,
            onTap: (slug) => context.go('/posts/${slug.value}'),
          ),
        _ => const SizedBox.shrink(),
      },
    );
  }
}
```

## Rules

- Dumb widgets never import Bloc or get_it.
- Containers never contain widget layout code beyond wiring.
- Presentation never imports Infrastructure.
- Routing logic lives in containers, not in dumb widgets.
