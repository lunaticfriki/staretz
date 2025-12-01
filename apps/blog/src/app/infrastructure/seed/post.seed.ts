import { PostMother } from '../../domain/__tests__/mothers/post.mother';
import type { PostRepository } from '../../domain/repositories/post.repository';

export const seedPosts = async (repository: PostRepository) => {
  const posts = Array.from({ length: 10 }, () => PostMother.createRandom());
  for (const post of posts) {
    await repository.save(post);
  }
};
