---
id: "22"
title: "Code Generation in Dart"
slug: "code-generation-in-dart"
imageUrl: "https://picsum.photos/seed/codegen/800/600"
excerpt: "Using build_runner and source_gen to automate boilerplate."
publishedAt: "2026-06-13"
---

Code generation in Dart works through build_runner, which runs builders that read source files and produce generated .g.dart files. Common use cases are JSON serialisation, route generation, and mock creation.

json_serializable generates fromJson and toJson methods from annotated classes. freezed generates immutable value types with copyWith, equality, and pattern matching. drift generates type-safe database queries.

Generated files should be committed to version control so that CI doesn't need a build step. Run dart run build_runner build --delete-conflicting-outputs to regenerate.
