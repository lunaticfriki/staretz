import '../../domain/entities/post.dart';
import '../../domain/services/read_service.dart';
import '../../domain/services/write_service.dart';
import '../../domain/services/state_service.dart';

class PostAppService {
  final ReadService _readService;
  final WriteService _writeService;
  final StateService _stateService;

  PostAppService(this._readService, this._writeService, this._stateService);

  Stream<List<Post>> get posts => _readService.getPosts();

  Stream<Post?> get selectedPost => _stateService.selectedPost;

  void selectPost(Post post) {
    _stateService.selectPost(post);
  }

  void clearSelection() {
    _stateService.clearSelection();
  }

  Future<void> addComment(String postId, String comment) async {
    await _writeService.addComment(postId, comment);
  }
}
