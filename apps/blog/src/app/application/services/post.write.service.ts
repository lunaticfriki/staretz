import { injectable, inject } from 'inversify';
import { Post } from '../../domain/entities/post';
import type { PostRepository } from '../../domain/repositories/post.repository';

@injectable()
export class PostWriteService {
  constructor(
    @inject('PostRepository') private postRepository: PostRepository
  ) {}

  async createPost(post: Post): Promise<void> {
    await this.postRepository.save(post);
  }
}
