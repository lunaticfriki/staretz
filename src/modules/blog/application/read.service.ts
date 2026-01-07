import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { PostRepository } from '../domain/repositories/post.repository';
import { Post } from '../domain/entities/post';

@injectable()
export class PostReadService {
  constructor(@inject(TYPES.PostRepository) private repository: PostRepository) {}

  async getPosts(): Promise<Post[]> {
    return this.repository.getAll();
  }

  async getPost(id: string): Promise<Post | null> {
    return this.repository.getById(id);
  }
}
