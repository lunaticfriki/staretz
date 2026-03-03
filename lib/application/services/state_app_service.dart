import '../../domain/entities/post.dart';
import '../../domain/services/state_service.dart';

class StateAppService {
  final StateService _stateService;

  StateAppService(this._stateService);

  Stream<Post?> get selectedPost => _stateService.selectedPost;

  void selectPost(Post post) {
    _stateService.selectPost(post);
  }

  void clearSelection() {
    _stateService.clearSelection();
  }
}
