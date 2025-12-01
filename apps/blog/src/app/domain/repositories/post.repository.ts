import { Post } from '../entities/post';

export abstract class PostRepository {
  abstract findAll(): Promise<Post[]>;
  abstract findById(id: string): Promise<Post | null>;
  abstract save(post: Post): Promise<void>;
}
