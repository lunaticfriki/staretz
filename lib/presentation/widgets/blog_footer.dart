import 'package:flutter/material.dart';

class BlogFooter extends StatelessWidget {
  const BlogFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final year = DateTime.now().year;

    return BottomAppBar(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('© ', style: Theme.of(context).textTheme.bodyMedium),
            Text(
              '$year',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(' staretz', style: Theme.of(context).textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }
}
