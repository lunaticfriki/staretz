---
id: "3"
title: "State Management with Bloc"
slug: "state-management-with-bloc"
imageUrl: "https://picsum.photos/seed/bloc/800/600"
excerpt: "Using flutter_bloc to manage application state predictably and testably."
publishedAt: "2026-01-25"
---

Bloc (Business Logic Component) separates presentation from business logic. A Cubit is the simpler form — it exposes methods that emit new states. The UI rebuilds via BlocBuilder whenever state changes.

The key benefit is testability: you can test a Cubit in isolation by verifying which states it emits in response to method calls. No widget tests needed to verify business logic.

For dependency injection, combine Bloc with get_it. Register your Cubits as factories so each widget tree gets a fresh instance, and register services as lazy singletons.
