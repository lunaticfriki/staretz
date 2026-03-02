import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'post_state.dart';
import '../services/post_app_service.dart';

class PostCubit extends Cubit<PostState> {
  final PostAppService _appService;
  StreamSubscription? _postsSubscription;

  PostCubit(this._appService) : super(PostInitial()) {
    _loadPosts();
  }

  void _loadPosts() {
    emit(PostLoading());
    _postsSubscription = _appService.posts.listen(
      (posts) {
        emit(PostLoaded(posts));
      },
      onError: (error) {
        emit(PostError(error.toString()));
      },
    );
  }

  void selectPost(String id) {
    // Basic navigation or loading logic before actually switching
    // Actually the selected post state is handled by state service
    // So if you wanted, you could sub to _appService.selectedPost as well.
    // However, keeping things simple, let's just trigger selection and state change based on loaded posts.
    if (state is PostLoaded) {
      final posts = (state as PostLoaded).posts;
      try {
        final post = posts.firstWhere((p) => p.id == id);
        _appService.selectPost(post);
        emit(PostSelected(post));
      } catch (e) {
        emit(const PostError('Post not found'));
      }
    }
  }

  void clearSelection() {
    _appService.clearSelection();
    // Assuming you want to go back to loaded state
    _loadPosts();
  }

  Future<void> addComment(String postId, String comment) async {
    try {
      await _appService.addComment(postId, comment);
      // Might want to reload or update specific post. In-memory will trigger a stream event.
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
