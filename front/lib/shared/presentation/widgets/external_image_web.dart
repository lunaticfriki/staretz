import 'dart:ui_web' as ui_web;

import 'package:flutter/material.dart';
import 'package:web/web.dart' as web;

class ExternalImage extends StatefulWidget {
  final String src;
  final BoxFit fit;

  const ExternalImage({super.key, required this.src, this.fit = BoxFit.cover});

  @override
  State<ExternalImage> createState() => _ExternalImageState();
}

class _ExternalImageState extends State<ExternalImage> {
  static final _registered = <String>{};

  late final String _viewType;

  @override
  void initState() {
    super.initState();
    _viewType = 'ext-img-${widget.src.hashCode}';
    if (_registered.add(_viewType)) {
      final src = widget.src;
      final objectFit = _toCss(widget.fit);
      ui_web.platformViewRegistry.registerViewFactory(_viewType, (_) {
        final img =
            web.document.createElement('img') as web.HTMLImageElement;
        img.src = src;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = objectFit;
        img.style.pointerEvents = 'none';
        return img;
      });
    }
  }

  static String _toCss(BoxFit fit) => switch (fit) {
        BoxFit.cover => 'cover',
        BoxFit.contain => 'contain',
        BoxFit.fill => 'fill',
        BoxFit.scaleDown => 'scale-down',
        BoxFit.none => 'none',
        _ => 'cover',
      };

  @override
  Widget build(BuildContext context) => HtmlElementView(viewType: _viewType);
}
