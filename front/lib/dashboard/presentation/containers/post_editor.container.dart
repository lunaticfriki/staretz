import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:staretz/dashboard/application/post_edit.state_service.dart';
import 'package:staretz/dashboard/application/post_edit_state.dart';
import 'package:staretz/dashboard/presentation/widgets/post_editor_form.dart';

class PostEditorContainer extends StatelessWidget {
  const PostEditorContainer({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<PostEditStateService, PostEditState>(
      listener: (context, state) {
        if (state.status == PostEditStatus.saved) {
          context.go('/dashboard');
        }
      },
      builder: (context, state) {
        if (state.status == PostEditStatus.saving) {
          return const Center(child: CircularProgressIndicator());
        }
        return PostEditorForm(
          initial: state.editing,
          onSave: (post) =>
              context.read<PostEditStateService>().savePost(post),
        );
      },
    );
  }
}
