import { injectable } from 'inversify';
import { Post } from '../../domain/entities/post';
import type { PostRepository } from '../../domain/repositories/post.repository';

@injectable()
export class InMemoryPostRepository implements PostRepository {
  private posts: Post[] = [];

  async findAll(): Promise<Post[]> {
    return [...this.posts];
  }

  async findById(id: string): Promise<Post | null> {
    const post = this.posts.find((p) => p.getValue().id === id);
    return post || null;
  }

  async save(post: Post): Promise<void> {
    const index = this.posts.findIndex(
      (p) => p.getValue().id === post.getValue().id
    );
    if (index !== -1) {
      this.posts[index] = post;
    } else {
      this.posts.push(post);
    }
  }
}
