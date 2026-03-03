import 'package:flutter/material.dart';

import '../../config/constants.dart';
import '../../config/translations.dart';

class BlogFooter extends StatelessWidget {
  const BlogFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final year = DateTime.now().year;

    return BottomAppBar(
      color: Colors.black,
      padding: EdgeInsets.zero,
      child: Stack(
        children: [
          Center(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    AppTranslations.copyright,
                    style: TextStyle(color: Colors.white),
                  ),
                  Text(
                    '$year',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Padding(padding: EdgeInsets.symmetric(horizontal: 4)),
                  Image.asset(AppConstants.logoNameBlack, height: 24),
                ],
              ),
            ),
          ),
          Positioned(
            right: 16,
            bottom: 16,
            child: Image.asset(AppConstants.logoNameFaceBlack, height: 42),
          ),
        ],
      ),
    );
  }
}
