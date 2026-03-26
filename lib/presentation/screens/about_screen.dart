import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/translations.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            AppTranslations.aboutStaretz,
            style: Theme.of(context).textTheme.displayMedium?.copyWith(
              fontWeight: FontWeight.bold,
              letterSpacing: 8.0,
            ),
          ),
          const SizedBox(height: 32),
          Text.rich(
            TextSpan(
              children: [
                const TextSpan(text: AppTranslations.aboutVersionPrefix),
                TextSpan(
                  text: AppTranslations.aboutVersionNumber,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                AppTranslations.aboutAuthorPrefix,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              InkWell(
                onTap: () =>
                    launchUrl(Uri.parse('https://github.com/lunaticfriki')),
                child: Text(
                  AppTranslations.aboutAuthorHandle,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
              Text(
                AppTranslations.aboutAuthorPunctuation,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              Text(
                AppTranslations.aboutAuthorYear,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
