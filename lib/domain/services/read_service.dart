import '../entities/post.dart';

abstract class ReadService {
  Stream<List<Post>> getPosts();
  Stream<Post?> getPost(String id);
}
