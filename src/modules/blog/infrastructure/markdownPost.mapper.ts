import { Post } from '../domain/entities/post';
import { Author } from '../domain/valueObjects/author.vo';

export class MarkdownPostMapper {
  static toDomain(raw: string): Post | null {
    try {
      const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
      const match = raw.match(frontmatterRegex);

      if (!match) {
        return null;
      }

      const [, frontmatter, content] = match;
      const metadata = this.parseFrontmatter(frontmatter);

      return Post.create(
        metadata.id,
        metadata.title,
        metadata.slug || '',
        content.trim(),
        new Date(metadata.date),
        new Date(metadata.updatedAt || metadata.date),
        metadata.image || '',
        Author.create(metadata.author, metadata.authorEmail || '', metadata.authorAvatar || ''),
        metadata.section || 'blog',
        this.parseTags(metadata.tags),
        metadata.topic || 'General',
      );
    } catch (e) {
      console.error('Failed to parse post markdown', e);
      return null;
    }
  }

  private static parseFrontmatter(frontmatter: string): Record<string, string> {
    const lines = frontmatter.split('\n');
    const metadata: Record<string, string> = {};

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        metadata[key] = value;
      }
    }

    return metadata;
  }

  private static parseTags(tags: string | undefined): string[] {
    if (!tags) {
      return [];
    }

    if (tags.startsWith('[') && tags.endsWith(']')) {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          return parsed.map((t) => String(t).trim());
        }
      } catch (e) {
        console.warn('Failed to parse tags as JSON, falling back to comma split', e);
      }
    }

    let cleanTags = tags;
    if (cleanTags.startsWith('[') && cleanTags.endsWith(']')) {
      cleanTags = cleanTags.slice(1, -1);
    }

    return cleanTags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }
}
