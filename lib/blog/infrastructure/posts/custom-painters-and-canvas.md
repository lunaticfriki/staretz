---
id: "13"
title: "Custom Painters and Canvas"
slug: "custom-painters-and-canvas"
imageUrl: "https://picsum.photos/seed/canvas/800/600"
excerpt: "Drawing custom graphics with Flutter's Canvas and CustomPainter API."
publishedAt: "2026-04-12"
---

CustomPainter gives you direct access to the Canvas, where you can draw paths, shapes, text, and images. Override paint() to issue draw calls and shouldRepaint() to control when the canvas is invalidated.

For charts and visualisations, start with paths. A Path can describe any shape via lineTo, cubicTo, and arcTo. Fill or stroke with a Paint configured with color, strokeWidth, and style.

Animate custom painters by passing an Animation<double> and calling repaint on the animation. The Listenable-based repaint system is more efficient than rebuilding the whole widget tree.
