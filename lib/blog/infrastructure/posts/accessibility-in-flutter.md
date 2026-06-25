---
id: "19"
title: "Accessibility in Flutter"
slug: "accessibility-in-flutter"
imageUrl: "https://picsum.photos/seed/a11y/800/600"
excerpt: "Making Flutter apps accessible to users with disabilities."
publishedAt: "2026-05-30"
---

Flutter has built-in semantics support. Interactive widgets like buttons and form fields automatically expose the right semantics to screen readers. For custom widgets, wrap with Semantics to describe the widget's role and label.

Test accessibility with the Accessibility Scanner on Android or VoiceOver on iOS. In Flutter DevTools, the Accessibility tab shows the semantics tree.

Colour contrast matters: text should meet WCAG AA standards (4.5:1 for normal text). Avoid conveying information through colour alone — use icons or text as secondary indicators.
