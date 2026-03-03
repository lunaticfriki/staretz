import '../entities/post.dart';

abstract class ReadService {
  Stream<List<Post>> getPosts({String? tag});
  Stream<Post?> getPost(String id);
}
