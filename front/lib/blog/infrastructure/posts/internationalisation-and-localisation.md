---
id: "18"
title: "Internationalisation and Localisation"
slug: "internationalisation-and-localisation"
imageUrl: "https://picsum.photos/seed/i18n/800/600"
excerpt: "Supporting multiple languages and locales in Flutter applications."
publishedAt: "2026-05-22"
---

Flutter's intl package and the flutter_localizations package together provide full internationalisation support. Define ARB files with your string resources, generate Dart classes with flutter gen-l10n, and access them via AppLocalizations.of(context).

Date and number formatting is locale-aware via the intl package. Always format dates and currencies through intl rather than string interpolation to get correct locale-specific output.

For right-to-left languages, Flutter handles text direction automatically. Check Directionality.of(context) if you need to mirror custom layouts.
