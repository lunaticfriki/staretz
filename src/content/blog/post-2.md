---
title: "Understanding Preact Signals for State"
description: "How we apply Signals to application services per the new agent guidelines."
pubDate: 2026-03-30
heroImage: "https://picsum.photos/seed/post2/800/400"
---

Signals offer incredibly fine-grained reactivity. Instead of passing down huge state trees (like in Redux), or deeply nesting providers (like in Context), `Signals` can be exported directly from standard TypeScript services.

### Example
We just import `@preact/signals-core` and instantiate `signal(0)`. Components can subscribe to changes independently, bypassing heavy diffing.

This perfectly compliments the Astro Islands architecture for interactive bits!
