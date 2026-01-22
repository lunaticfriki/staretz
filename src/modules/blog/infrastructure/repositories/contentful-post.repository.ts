import { injectable, inject } from 'inversify';
import { createClient, type ContentfulClientApi } from 'contentful';
import { PostRepository } from '../../domain/repositories/post.repository';
import { Post } from '../../domain/entities/post';
import { TYPES } from '../../../../di/types';
import type { ContentfulConfig } from '../../domain/ports/contentful.config';
import { ContentfulPostMapper, type ContentfulPostEntry } from '../mappers/contentfulPost.mapper';

@injectable()
export class ContentfulPostRepository extends PostRepository {
  private client: ContentfulClientApi<undefined>;

  constructor(@inject(TYPES.ContentfulConfig) config: ContentfulConfig) {
    super();
    this.client = createClient({
      space: config.spaceId,
      accessToken: config.accessToken,
    });
  }

  async getAll(): Promise<Post[]> {
    const entries = await this.client.getEntries({
      content_type: 'post',
      order: ['-sys.createdAt'],
    });

    return entries.items.map((entry) =>
      ContentfulPostMapper.toDomain(entry as unknown as ContentfulPostEntry),
    );
  }

  async getById(id: string): Promise<Post | null> {
    try {
      const entry = await this.client.getEntry(id);
      return ContentfulPostMapper.toDomain(entry as unknown as ContentfulPostEntry);
    } catch (error) {
      console.error(`Error fetching post ${id} from Contentful:`, error);
      return null;
    }
  }
}
