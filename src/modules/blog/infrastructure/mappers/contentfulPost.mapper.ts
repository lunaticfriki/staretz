import { Post } from '../../domain/entities/post';
import { Author } from '../../domain/valueObjects/author.vo';

interface ContentfulAsset {
  fields: {
    file: {
      url: string;
    };
  };
}

interface ContentfulAuthor {
  fields: {
    name: string;
    email: string;
    avatar: ContentfulAsset;
  };
}

interface ContentfulRichTextNode {
  nodeType: string;
  content?: ContentfulRichTextNode[];
  value?: string;
}

interface ContentfulRichTextDocument {
  content: ContentfulRichTextNode[];
}

interface ContentfulPostFields {
  title?: string;
  slug?: string;
  content?: unknown;
  image?: ContentfulAsset | ContentfulAsset[];
  author?: ContentfulAuthor;
  section?: string;
  tags?: string[];
  topic?: string;
}

export interface ContentfulPostEntry {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: ContentfulPostFields;
}

export class ContentfulPostMapper {
  static toDomain(entry: ContentfulPostEntry): Post {
    const fields = entry.fields;
    const sys = entry.sys;

    let imageUrl = '';
    const imageField = fields.image;
    if (Array.isArray(imageField) && imageField.length > 0) {
      imageUrl = (imageField[0] as ContentfulAsset)?.fields?.file?.url || '';
    } else if (imageField) {
      imageUrl = (imageField as ContentfulAsset)?.fields?.file?.url || '';
    }
    if (imageUrl) {
      imageUrl = `https:${imageUrl}`;
    }

    let content = '';
    if (typeof fields.content === 'string') {
      content = fields.content;
    } else if (fields.content && typeof fields.content === 'object') {
      try {
        const contentObj = fields.content as unknown as ContentfulRichTextDocument;
        if (contentObj.content && Array.isArray(contentObj.content)) {
          content = contentObj.content
            .map((node: ContentfulRichTextNode) => {
              if (node.nodeType === 'paragraph' && node.content) {
                return node.content
                  .map((child: ContentfulRichTextNode) =>
                    child.nodeType === 'text' ? child.value || '' : '',
                  )
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
        fields.author?.fields?.name || 'Unknown',
        fields.author?.fields?.email || '',
        fields.author?.fields?.avatar?.fields?.file?.url
          ? `https:${fields.author.fields.avatar.fields.file.url}`
          : '',
      ),
      (fields.section as string) || 'blog',
      (fields.tags as string[]) || [],
      (fields.topic as string) || 'General',
    );
  }
}
