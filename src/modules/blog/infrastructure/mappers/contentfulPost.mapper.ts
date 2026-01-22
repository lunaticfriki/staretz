import type { Entry } from 'contentful';
import { Post } from '../../domain/entities/post';
import { Author } from '../../domain/valueObjects/author.vo';

export class ContentfulPostMapper {
  static toDomain(entry: Entry<any>): Post {
    const fields = entry.fields;
    const sys = entry.sys;

    let imageUrl = '';
    const imageField = fields.image;
    if (Array.isArray(imageField) && imageField.length > 0) {
      imageUrl = (imageField[0] as any)?.fields?.file?.url || '';
    } else if (imageField) {
      imageUrl = (imageField as any)?.fields?.file?.url || '';
    }
    if (imageUrl) {
      imageUrl = `https:${imageUrl}`;
    }

    let content = '';
    if (typeof fields.content === 'string') {
      content = fields.content;
    } else if (fields.content && typeof fields.content === 'object') {
      try {
        const contentObj = fields.content as any;
        if (contentObj.content && Array.isArray(contentObj.content)) {
          content = contentObj.content
            .map((node: any) => {
              if (node.nodeType === 'paragraph' && node.content) {
                return node.content
                  .map((child: any) => (child.nodeType === 'text' ? child.value : ''))
                  .join('');
              }
              return '';
            })
            .join('\n\n');
        }
      } catch (e) {
        console.error('Error parsing rich text content', e);
        content = '';
      }
    }

    return Post.create(
      sys.id,
      fields.title as string,
      (fields.slug as string) || '',
      content,
      new Date(sys.createdAt),
      new Date(sys.updatedAt),
      imageUrl,
      Author.create(
        (fields.author as any)?.fields?.name || 'Unknown',
        (fields.author as any)?.fields?.email || '',
        (fields.author as any)?.fields?.avatar?.fields?.file?.url
          ? `https:${(fields.author as any).fields.avatar.fields.file.url}`
          : '',
      ),
      (fields.section as string) || 'blog',
      (fields.tags as string[]) || [],
      (fields.topic as string) || 'General',
    );
  }
}
