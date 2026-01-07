import { Post } from '../entities/post';
import { injectable } from 'inversify';

@injectable()
export abstract class PostRepository {
  abstract getAll(): Promise<Post[]>;
  abstract getById(id: string): Promise<Post | null>;
}
