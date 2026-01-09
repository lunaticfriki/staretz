import { Post } from '../modules/blog/domain/entities/post';
import { PostRepository } from '../modules/blog/domain/repositories/post.repository';
import { inject, injectable } from 'inversify';
import { signal } from '@preact/signals';

import { TYPES } from '../di/types';

@injectable()
export class HomeViewModel {
  public posts = signal<Post[]>([]);
  public loading = signal<boolean>(true);

  constructor(@inject(TYPES.PostRepository) private readonly postRepository: PostRepository) {
    this.loadPosts();
  }

  async loadPosts() {
    this.loading.value = true;
    try {
      const allPosts = await this.postRepository.getAll();
      this.posts.value = allPosts;
    } catch (error) {
      console.error('Failed to load posts', error);
    } finally {
      this.loading.value = false;
    }
  }

  getLatestPosts(section: string, limit: number = 3): Post[] {
    return this.posts.value
      .filter((post) => post.section && post.section.toLowerCase() === section.toLowerCase())
      .slice(0, limit);
  }
}
