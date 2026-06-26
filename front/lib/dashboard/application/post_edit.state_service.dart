import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz/blog/application/post.read_service.dart';
import 'package:staretz/dashboard/application/post.write_service.dart';
import 'package:staretz/dashboard/application/post_edit_state.dart';

class PostEditStateService extends Cubit<PostEditState> {
  final PostReadService _read;
  final PostWriteService _write;

  PostEditStateService(this._read, this._write)
      : super(PostEditState.initial());

  Future<void> loadPage(PageCriteria criteria) async {
    emit(state.copyWith(status: PostEditStatus.loading, criteria: criteria));
    try {
      final page = await _read.getPage(criteria);
      emit(state.copyWith(
        status: PostEditStatus.loaded,
        posts: page.items,
        totalCount: page.totalCount,
      ));
    } catch (_) {
      emit(state.copyWith(status: PostEditStatus.error));
    }
  }

  void startEditing(Post post) {
    emit(state.copyWith(status: PostEditStatus.loaded, editing: post));
  }

  void clearEditing() => emit(state.withoutEditing());

  Future<void> savePost(Post post) async {
    emit(state.copyWith(status: PostEditStatus.saving));
    try {
      final originalSlug = state.editing?.slug;
      if (originalSlug != null) {
        await _write.update(originalSlug, post);
      } else {
        await _write.save(post);
      }
      emit(state.copyWith(status: PostEditStatus.saved));
      await loadPage(state.criteria);
    } catch (_) {
      emit(state.copyWith(status: PostEditStatus.error));
    }
  }

  Future<void> deletePost(PostSlug slug) async {
    emit(state.copyWith(status: PostEditStatus.saving));
    try {
      await _write.delete(slug);
      await loadPage(state.criteria);
    } catch (_) {
      emit(state.copyWith(status: PostEditStatus.error));
    }
  }
}
