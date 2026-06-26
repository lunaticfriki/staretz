import 'package:flutter/material.dart';

class ExternalImage extends StatelessWidget {
  final String src;
  final BoxFit fit;

  const ExternalImage({super.key, required this.src, this.fit = BoxFit.cover});

  @override
  Widget build(BuildContext context) => Image.network(
        src,
        fit: fit,
        width: double.infinity,
        height: double.infinity,
      );
}
