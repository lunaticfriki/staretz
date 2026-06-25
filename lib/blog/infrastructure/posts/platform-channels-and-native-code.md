---
id: "20"
title: "Platform Channels and Native Code"
slug: "platform-channels-and-native-code"
imageUrl: "https://picsum.photos/seed/platform/800/600"
excerpt: "Bridging Flutter and native platform APIs with MethodChannel."
publishedAt: "2026-06-07"
---

Platform channels let Flutter code call native Kotlin/Swift/C++ APIs. Define a MethodChannel with a unique name, call invokeMethod from Dart, and handle it in the platform-specific code.

For bidirectional communication, EventChannel streams events from native to Dart. This is useful for sensor data, notifications, or any native event source.

Keep platform channel code thin. The native side should only do what Dart can't — heavy logic belongs in Dart. Document the interface carefully since it crosses a type system boundary.
