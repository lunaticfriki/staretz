import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:staretz/blog/application/post.read_service.dart';
import 'package:staretz/blog/application/post_state.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';

class PostStateService extends Cubit<PostState> {
  final PostReadService _read;

  PostStateService(this._read) : super(PostState.initial());

  Future<void> loadPreview(int limit) async {
    emit(state.copyWith(status: PostStatus.loading));
    try {
      final posts = await _read.getPreview(limit);
      emit(state.copyWith(status: PostStatus.loaded, posts: posts));
    } catch (_) {
      emit(state.copyWith(status: PostStatus.error));
    }
  }

  Future<void> loadPage(PageCriteria criteria) async {
    emit(state.copyWith(status: PostStatus.loading, criteria: criteria));
    try {
      final page = await _read.getPage(criteria);
      emit(state.copyWith(
        status: PostStatus.loaded,
        posts: page.items,
        totalCount: page.totalCount,
        criteria: criteria,
      ));
    } catch (_) {
      emit(state.copyWith(status: PostStatus.error));
    }
  }

  Future<void> loadBySlug(PostSlug slug) async {
    emit(state.copyWith(status: PostStatus.loading));
    try {
      final post = await _read.getBySlug(slug);
      emit(PostState(
        status: PostStatus.loaded,
        posts: state.posts,
        totalCount: state.totalCount,
        selectedPost: post,
        criteria: state.criteria,
      ));
    } catch (_) {
      emit(state.copyWith(status: PostStatus.error));
    }
  }
}
