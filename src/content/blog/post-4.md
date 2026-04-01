---
title: "The Hexagonal Approach in Frontend"
description: "Applying Ports and Adapters to modern JS frameworks."
pubDate: 2026-03-28
heroImage: "https://picsum.photos/seed/post4/800/400"
author: "Vania"
---

Per our TS Agent Guidelines, we strongly advocate for **Abstract Classes** acting as ports to insulate the Domain logic from UI libraries like Astro or React.

### Practical Steps
1. Define the Business Logic in plain TS files.
2. Abstract API fetches behind `HttpAdapter` interfaces.
3. Inject the `HttpAdapter` into the use case.

This leaves our Astro components to *only* concern themselves with rendering and wiring up state.
