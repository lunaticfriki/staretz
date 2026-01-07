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
        content.trim(),
        new Date(metadata.date),
        new Date(metadata.updatedAt || metadata.date),
        metadata.image || '',
        Author.create(metadata.author, metadata.authorEmail || '', metadata.authorAvatar || ''),
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
}
