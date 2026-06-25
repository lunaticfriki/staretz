---
id: "4"
title: "Dart Value Objects and Validation"
slug: "dart-value-objects-and-validation"
imageUrl: "https://picsum.photos/seed/valueobj/800/600"
excerpt: "Wrapping primitives in value objects to enforce invariants at the type level."
publishedAt: "2026-02-02"
---

Primitive obsession is a common code smell where raw strings, ints, and booleans flow through your system without any semantic meaning. Value objects solve this by wrapping primitives with validation and domain meaning.

A value object has no identity — two objects with the same value are equal. In Dart, implement == and hashCode to enforce this. Use a private constructor and a static factory that validates before constructing.

This catches bugs at the boundary: if you pass an empty string where a PostTitle is expected, the error surfaces immediately rather than propagating silently through your system.
