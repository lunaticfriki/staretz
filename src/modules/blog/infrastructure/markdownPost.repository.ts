import { injectable } from 'inversify';
import { PostRepository } from '../domain/repositories/post.repository';
import { Post } from '../domain/entities/post';
import { MarkdownPostMapper } from './markdownPost.mapper';

@injectable()
export class MarkdownPostRepository extends PostRepository {
  private posts: Post[] = [];
  private initialized = false;

  async getAll(): Promise<Post[]> {
    if (!this.initialized) {
      await this.loadPosts();
    }
    return this.posts;
  }

  async getById(id: string): Promise<Post | null> {
    if (!this.initialized) {
      await this.loadPosts();
    }
    return this.posts.find((p) => p.id === id) || null;
  }

  private async loadPosts() {
    const modules = import.meta.glob('../../../../content/posts/*.md', {
      query: '?raw',
      import: 'default',
    });

    const posts: Post[] = [];

    for (const path in modules) {
      try {
        const rawContent = await modules[path]();
        const post = MarkdownPostMapper.toDomain(rawContent as string);

        if (post) {
          posts.push(post);
        }
      } catch (e) {
        console.error(`Failed to load post at ${path}`, e);
      }
    }

    this.posts = posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    this.initialized = true;
  }
}
