import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:staretz/dashboard/application/post_edit.state_service.dart';
import 'package:staretz/dashboard/presentation/widgets/dashboard_nav.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz/shared/presentation/widgets/header.dart';

class DashboardShellContainer extends StatelessWidget {
  final String location;
  final Widget child;

  const DashboardShellContainer({
    super.key,
    required this.location,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: GetIt.instance<PostEditStateService>(),
      child: _ShellLayout(location: location, child: child),
    );
  }
}

class _ShellLayout extends StatelessWidget {
  final String location;
  final Widget child;

  const _ShellLayout({required this.location, required this.child});

  DashboardSection get _activeSection =>
      location.endsWith('/new') || location.endsWith('/edit')
          ? DashboardSection.newPost
          : DashboardSection.editPost;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeStateService, ThemeState>(
      builder: (context, themeState) => Scaffold(
        body: Column(
          children: [
            Header(
              currentTheme: themeState.theme,
              onToggle: () => context.read<ThemeStateService>().toggle(),
            ),
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  DashboardNav(
                    active: _activeSection,
                    onNewPost: () {
                      context.read<PostEditStateService>().clearEditing();
                      context.go('/dashboard/new');
                    },
                    onEditPost: () => context.go('/dashboard'),
                  ),
                  Expanded(child: child),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
