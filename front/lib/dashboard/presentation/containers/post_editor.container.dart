import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:staretz/dashboard/application/post_edit.state_service.dart';
import 'package:staretz/dashboard/application/post_edit_state.dart';
import 'package:staretz/dashboard/presentation/widgets/post_editor_form.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz/shared/presentation/widgets/header.dart';

class PostEditorContainer extends StatelessWidget {
  const PostEditorContainer({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: GetIt.instance<PostEditStateService>(),
      child: const _EditorLayout(),
    );
  }
}

class _EditorLayout extends StatelessWidget {
  const _EditorLayout();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeStateService, ThemeState>(
      builder: (context, themeState) => Scaffold(
        body: Column(
          children: [
            Header(
              currentTheme: themeState.theme,
              onToggle: () => context.read<ThemeStateService>().toggle(),
              onBack: () => context.go('/dashboard'),
            ),
            Expanded(
              child: BlocConsumer<PostEditStateService, PostEditState>(
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
              ),
            ),
          ],
        ),
      ),
    );
  }
}
