import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'post_state.dart';
import '../services/read_app_service.dart';
import '../services/write_app_service.dart';
import '../services/state_app_service.dart';

class PostCubit extends Cubit<PostState> {
  final ReadAppService _readAppService;
  final WriteAppService _writeAppService;
  final StateAppService _stateAppService;

  StreamSubscription? _postsSubscription;

  PostCubit(this._readAppService, this._writeAppService, this._stateAppService)
    : super(PostInitial()) {
    _loadPosts();
  }

  void loadPosts({String? tag}) {
    _loadPosts(tag: tag);
  }

  void _loadPosts({String? tag}) {
    emit(PostLoading());
    _postsSubscription?.cancel();
    _postsSubscription = _readAppService
        .getPosts(tag: tag)
        .listen(
          (posts) {
            emit(PostLoaded(posts));
          },
          onError: (error) {
            emit(PostError(error.toString()));
          },
        );
  }

  void selectPost(String id) {
    if (state is PostLoaded) {
      final posts = (state as PostLoaded).posts;
      try {
        final post = posts.firstWhere((p) => p.id == id);
        _stateAppService.selectPost(post);
        emit(PostSelected(post));
      } catch (e) {
        emit(const PostError('Post not found'));
      }
    }
  }

  void clearSelection() {
    _stateAppService.clearSelection();
    _loadPosts();
  }

  Future<void> addComment(String postId, String comment) async {
    try {
      await _writeAppService.addComment(postId, comment);
    } catch (e) {
      emit(PostError(e.toString()));
    }
  }

  @override
  Future<void> close() {
    _postsSubscription?.cancel();
    return super.close();
  }
}
