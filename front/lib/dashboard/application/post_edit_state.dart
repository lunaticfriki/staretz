import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';

enum PostEditStatus { initial, loading, loaded, saving, saved, error }

class PostEditState {
  final PostEditStatus status;
  final List<Post> posts;
  final int totalCount;
  final Post? editing;
  final PageCriteria criteria;

  const PostEditState({
    required this.status,
    required this.posts,
    required this.totalCount,
    required this.criteria,
    this.editing,
  });

  factory PostEditState.initial() => const PostEditState(
        status: PostEditStatus.initial,
        posts: [],
        totalCount: 0,
        criteria: PageCriteria(page: 1, pageSize: 20),
      );

  PostEditState copyWith({
    PostEditStatus? status,
    List<Post>? posts,
    int? totalCount,
    Post? editing,
    PageCriteria? criteria,
  }) =>
      PostEditState(
        status: status ?? this.status,
        posts: posts ?? this.posts,
        totalCount: totalCount ?? this.totalCount,
        editing: editing ?? this.editing,
        criteria: criteria ?? this.criteria,
      );

  PostEditState withoutEditing() => PostEditState(
        status: status,
        posts: posts,
        totalCount: totalCount,
        criteria: criteria,
        editing: null,
      );
}
