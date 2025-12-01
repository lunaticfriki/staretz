import { injectable, inject } from 'inversify';
import { signal } from '@preact/signals-react';
import { Post } from '../../domain/entities/post';
import type { PostRepository } from '../../domain/repositories/post.repository';

@injectable()
export class PostReadService {
  public posts = signal<Post[]>([]);
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);

  constructor(
    @inject('PostRepository') private postRepository: PostRepository
  ) {}

  async loadPosts() {
    this.loading.value = true;
    this.error.value = null;
    try {
      const posts = await this.postRepository.findAll();
      this.posts.value = posts;
    } catch {
      this.error.value = 'Failed to load posts';
    } finally {
      this.loading.value = false;
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.postRepository.findById(id);
  }
}
