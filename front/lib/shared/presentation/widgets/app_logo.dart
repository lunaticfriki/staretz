import 'package:flutter/material.dart';

class AppLogo extends StatelessWidget {
  final double maxHeight;
  final double maxWidth;

  const AppLogo({
    super.key,
    this.maxHeight = 32,
    this.maxWidth = 140,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final asset = isDark
        ? 'assets/images/logo-black.jpg'
        : 'assets/images/logo-white.jpg';

    return ConstrainedBox(
      constraints: BoxConstraints(maxHeight: maxHeight, maxWidth: maxWidth),
      child: Image.asset(asset, fit: BoxFit.contain),
    );
  }
}
