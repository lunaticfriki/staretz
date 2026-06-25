import 'package:flutter/material.dart';

class PixelSunIcon extends StatelessWidget {
  final Color color;
  final double size;

  const PixelSunIcon({super.key, required this.color, this.size = 16});

  @override
  Widget build(BuildContext context) => CustomPaint(
        size: Size(size, size),
        painter: _PixelPainter(color: color, pixels: _pixels),
      );

  static const _pixels = [
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
  ];
}

class PixelMoonIcon extends StatelessWidget {
  final Color color;
  final double size;

  const PixelMoonIcon({super.key, required this.color, this.size = 16});

  @override
  Widget build(BuildContext context) => CustomPaint(
        size: Size(size, size),
        painter: _PixelPainter(color: color, pixels: _pixels),
      );

  static const _pixels = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
  ];
}

class PixelAutoIcon extends StatelessWidget {
  final Color color;
  final double size;

  const PixelAutoIcon({super.key, required this.color, this.size = 16});

  @override
  Widget build(BuildContext context) => CustomPaint(
        size: Size(size, size),
        painter: _PixelPainter(color: color, pixels: _pixels),
      );

  static const _pixels = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
  ];
}

class _PixelPainter extends CustomPainter {
  final Color color;
  final List<List<int>> pixels;

  const _PixelPainter({required this.color, required this.pixels});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final pixelSize = size.width / pixels.length;
    for (var r = 0; r < pixels.length; r++) {
      for (var c = 0; c < pixels[r].length; c++) {
        if (pixels[r][c] == 1) {
          canvas.drawRect(
            Rect.fromLTWH(c * pixelSize, r * pixelSize, pixelSize, pixelSize),
            paint,
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(_PixelPainter old) => old.color != color;
}
