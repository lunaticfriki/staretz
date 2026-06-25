---
id: "9"
title: "Asset Management and Fonts"
slug: "asset-management-and-fonts"
imageUrl: "https://picsum.photos/seed/assets/800/600"
excerpt: "Organising images, fonts, and data files in Flutter projects."
publishedAt: "2026-03-12"
---

Flutter bundles assets at build time. Declare them in pubspec.yaml under the flutter > assets section. Directories can be declared with a trailing slash to include all files.

Custom fonts are declared under flutter > fonts. You can specify weights and styles for the same family. Use GoogleFonts package if you want to pull fonts from the network.

For data files like JSON, load them with rootBundle.loadString() from flutter/services.dart. Parse the result with jsonDecode from dart:convert.
