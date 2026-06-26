import 'package:flutter/material.dart';
import 'package:staretz/shared/presentation/app_colors.dart';

enum DashboardSection { newPost, editPost }

class DashboardNav extends StatelessWidget {
  final DashboardSection active;
  final VoidCallback onNewPost;
  final VoidCallback onEditPost;

  const DashboardNav({
    super.key,
    required this.active,
    required this.onNewPost,
    required this.onEditPost,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
      decoration: BoxDecoration(
        border: Border(
          right: BorderSide(
            color: Theme.of(context).dividerColor,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _NavItem(
            label: 'add new post',
            isActive: active == DashboardSection.newPost,
            onTap: onNewPost,
          ),
          const SizedBox(height: 16),
          _NavItem(
            label: 'edit post',
            isActive: active == DashboardSection.editPost,
            onTap: onEditPost,
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavItem({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: onTap,
        child: Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: isActive
                ? AppColors.magenta
                : Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
          ),
        ),
      ),
    );
  }
}
