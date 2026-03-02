import '../entities/post.dart';

abstract class StateService {
  Stream<Post?> get selectedPost;
  void selectPost(Post post);
  void clearSelection();
}
