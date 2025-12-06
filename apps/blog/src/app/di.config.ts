import { InMemoryPostRepository } from './infrastructure/repositories/in-memory.post.repository';

const repository = new InMemoryPostRepository();

export const PostDI = {
  repository,
};
