---
id: "16"
title: "Local Storage and Persistence"
slug: "local-storage-and-persistence"
imageUrl: "https://picsum.photos/seed/storage/800/600"
excerpt: "Persisting data locally with shared_preferences, Hive, and SQLite."
publishedAt: "2026-05-06"
---

shared_preferences stores key-value pairs suitable for settings and small data. It's synchronous to read after initialisation, making it ideal for startup configuration.

For structured data, Hive is a lightweight NoSQL database. Define TypeAdapters for your domain objects and store them directly. It's fast and works across all Flutter platforms.

SQLite via sqflite or drift is best for relational data with complex queries. Drift provides type-safe query building with compile-time error detection.
