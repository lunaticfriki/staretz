import { inject, injectable } from 'inversify';
import { signal } from '@preact/signals';
import { TYPES } from '../../../di/types';
import { PostReadService } from './read.service';
import { Post } from '../domain/entities/post';

@injectable()
export class PostStateService {
  public posts = signal<Post[]>([]);
  public currentPost = signal<Post | null>(null);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);

  constructor(@inject(TYPES.PostReadService) private readService: PostReadService) {}

  async loadPosts() {
    this.isLoading.value = true;
    this.error.value = null;
    try {
      const posts = await this.readService.getPosts();
      this.posts.value = posts;
    } catch (e) {
      this.error.value = 'Failed to load posts';
      console.error(e);
    } finally {
      this.isLoading.value = false;
    }
  }

  async loadPost(id: string) {
    this.isLoading.value = true;
    this.error.value = null;
    this.currentPost.value = null;
    try {
      const post = await this.readService.getPost(id);
      this.currentPost.value = post;
    } catch (e) {
      this.error.value = 'Failed to load post';
      console.error(e);
    } finally {
      this.isLoading.value = false;
    }
  }
}
