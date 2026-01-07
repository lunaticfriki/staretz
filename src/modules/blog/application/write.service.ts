import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { PostRepository } from '../domain/repositories/post.repository';

@injectable()
export class PostWriteService {
  constructor(@inject(TYPES.PostRepository) _repository: PostRepository) {}
}
