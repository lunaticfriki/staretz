import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';

enum PostStatus { initial, loading, loaded, error }

class PostState {
  final PostStatus status;
  final List<Post> posts;
  final int totalCount;
  final Post? selectedPost;
  final PageCriteria criteria;

  const PostState({
    required this.status,
    required this.posts,
    required this.totalCount,
    required this.criteria,
    this.selectedPost,
  });

  factory PostState.initial() => const PostState(
        status: PostStatus.initial,
        posts: [],
        totalCount: 0,
        criteria: PageCriteria(page: 1, pageSize: 20),
      );

  PostState copyWith({
    PostStatus? status,
    List<Post>? posts,
    int? totalCount,
    Post? selectedPost,
    PageCriteria? criteria,
  }) =>
      PostState(
        status: status ?? this.status,
        posts: posts ?? this.posts,
        totalCount: totalCount ?? this.totalCount,
        selectedPost: selectedPost ?? this.selectedPost,
        criteria: criteria ?? this.criteria,
      );
}
