# Infrastructure Layer

## Responsibility

Infrastructure adapters implement the domain ports. They handle I/O: file reading, HTTP, parsing, serialisation. They are the only layer allowed to know about external systems.

## Repository adapter

```dart
class MarkdownPostRepository implements PostRepository {
  final Map<String, String> _sources;

  MarkdownPostRepository(this._sources);

  @override
  Future<List<Post>> findAll() async {
    return _sources.entries.map(_parse).toList();
  }

  @override
  Future<Post?> findBySlug(PostSlug slug) async {
    final entry = _sources.entries.cast<MapEntry<String, String>?>()
        .firstWhere((e) => e!.key.contains(slug.value), orElse: () => null);
    return entry == null ? null : _parse(entry);
  }

  Post _parse(MapEntry<String, String> entry) {
    // frontmatter + body parsing
  }
}
```

## Post Markdown files

Files live at `lib/blog/infrastructure/posts/*.md`. Frontmatter keys:

```yaml
---
title: My Post Title
slug: my-post-title
excerpt: A short summary.
publishedAt: 2026-06-24
---
Post body in Markdown.
```

Loaded at build time via Flutter asset bundling (declared in `pubspec.yaml`).

## Rules

- Adapters implement domain abstract classes — never extend them structurally.
- Parsing logic belongs here, not in the domain.
- Infrastructure may import Domain and Application (for service interfaces if needed), but never Presentation.
