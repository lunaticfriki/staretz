import 'package:flutter/material.dart';
import 'package:staretz/shared/presentation/app_colors.dart';

class PaginationBar extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final bool hasPrevious;
  final bool hasNext;
  final VoidCallback onPrevious;
  final VoidCallback onNext;

  const PaginationBar({
    super.key,
    required this.currentPage,
    required this.totalPages,
    required this.hasPrevious,
    required this.hasNext,
    required this.onPrevious,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    final textStyle = TextStyle(
      fontSize: 13,
      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7),
    );

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          IconButton(
            onPressed: hasPrevious ? onPrevious : null,
            icon: Icon(
              Icons.chevron_left,
              color: hasPrevious ? AppColors.magenta : null,
            ),
          ),
          const SizedBox(width: 8),
          Text('$currentPage / $totalPages', style: textStyle),
          const SizedBox(width: 8),
          IconButton(
            onPressed: hasNext ? onNext : null,
            icon: Icon(
              Icons.chevron_right,
              color: hasNext ? AppColors.magenta : null,
            ),
          ),
        ],
      ),
    );
  }
}
