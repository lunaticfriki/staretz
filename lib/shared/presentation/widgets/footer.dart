import 'package:flutter/material.dart';
import 'package:staretz/shared/presentation/app_colors.dart';
import 'package:url_launcher/url_launcher.dart';

class Footer extends StatelessWidget {
  const Footer({super.key});

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final logo = Image.asset('assets/images/logo-complete-black.jpg', height: 50);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        children: [
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: GestureDetector(
              onTap: () => launchUrl(
                Uri.parse('https://github.com/lunaticfriki/staretz'),
                webOnlyWindowName: '_blank',
              ),
              child: RichText(
                text: TextSpan(
                  style: TextStyle(
                    fontSize: 12,
                    color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.54),
                  ),
                  children: [
                    const TextSpan(text: 'staretz, '),
                    TextSpan(
                      text: '${DateTime.now().year}',
                      style: const TextStyle(color: AppColors.magenta),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const Spacer(),
          isLight
              ? ColorFiltered(
                  colorFilter: const ColorFilter.matrix([
                    -1, 0, 0, 0, 255,
                    0, -1, 0, 0, 255,
                    0, 0, -1, 0, 255,
                    0, 0, 0, 1, 0,
                  ]),
                  child: logo,
                )
              : logo,
        ],
      ),
    );
  }
}
