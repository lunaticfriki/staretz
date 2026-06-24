# Blog Features

## Current state

| Feature | Status |
|---------|--------|
| Home page — title only | Done |

## Planned features

| Feature | Description |
|---------|-------------|
| Post list | Display all published posts with title, excerpt, date |
| Post detail | Render a single post from Markdown |
| Post navigation | Next / previous post links |

## Post model

A post has:

- `id` — unique identifier
- `title` — display title
- `slug` — URL-safe identifier, used in routing
- `excerpt` — short summary shown in listings
- `body` — full Markdown content
- `publishedAt` — publication date

## Content source

Posts are Markdown files in `lib/blog/infrastructure/posts/`. Each file uses YAML frontmatter for metadata; the body is plain Markdown.

## Future content management

The `PostRepository` port decouples content delivery from the domain. Swapping the Markdown adapter for a CMS adapter (HTTP-based) requires only a new infrastructure implementation and a DI registration change — no domain or application code changes.
