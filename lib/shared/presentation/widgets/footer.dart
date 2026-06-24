import 'package:flutter/material.dart';
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
              child: Text(
                'staretz, ${DateTime.now().year}',
                style: TextStyle(
                  fontSize: 12,
                  color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.54),
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
