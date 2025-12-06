import { PostDI } from './di.config';
import { InMemoryPostRepository } from './infrastructure/repositories/in-memory.post.repository';

describe('PostDI', () => {
  it('should have a repository instance', () => {
    expect(PostDI.repository).toBeInstanceOf(InMemoryPostRepository);
  });
});
