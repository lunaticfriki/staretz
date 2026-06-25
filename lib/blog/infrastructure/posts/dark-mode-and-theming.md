---
id: "12"
title: "Dark Mode and Theming"
slug: "dark-mode-and-theming"
imageUrl: "https://picsum.photos/seed/darkmode/800/600"
excerpt: "Implementing a theme system with light/dark mode and custom extensions."
publishedAt: "2026-04-05"
---

Flutter's MaterialApp accepts theme and darkTheme. When themeMode is ThemeMode.system, it follows the OS setting. You can override this with ThemeMode.light or ThemeMode.dark.

ThemeExtension lets you attach custom design tokens to the theme. Define your color palette and typography as extension properties, then access them via Theme.of(context).extension<YourExtension>().

Persist the user's choice with shared_preferences. Load it at startup and emit the saved theme before showing any UI to avoid a flash.
