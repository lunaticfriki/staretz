---
id: "11"
title: "Dependency Injection with get_it"
slug: "dependency-injection-with-get-it"
imageUrl: "https://picsum.photos/seed/getit/800/600"
excerpt: "Wiring up services and repositories using a service locator pattern."
publishedAt: "2026-03-28"
---

get_it is a service locator for Dart. Register types with registerLazySingleton for shared instances or registerFactory for fresh instances per call. Resolve with GetIt.instance<T>().

The key is to register everything at startup in a single container setup function. This makes it easy to swap implementations for testing — just re-register with a mock.

For Cubits, always use registerFactory so each BlocProvider gets a fresh Cubit with clean state. Services and repositories can be singletons since they hold no UI state.
