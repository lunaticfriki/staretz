import { HomeViewModel } from '../home.viewModel';
import { PostRepository } from '../../modules/blog/domain/repositories/post.repository';
import { PostMother } from '../../modules/blog/domain/__tests__/mothers/post.mother';
import { vi, describe, it, expect } from 'vitest';

describe('HomeViewModel', () => {
  it('should load posts on initialization', async () => {
    const mockRepo = {
      getAll: vi.fn().mockResolvedValue([]),
    } as unknown as PostRepository;

    new HomeViewModel(mockRepo);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockRepo.getAll).toHaveBeenCalled();
  });

  it('should filter posts by section', async () => {
    const blogPost = PostMother.createWithData(
      '1',
      't1',
      'c1',
      new Date(),
      new Date(),
      'img1',
      PostMother.createRandom().author,
      'blog',
    );
    const musicPost = PostMother.createWithData(
      '2',
      't2',
      'c2',
      new Date(),
      new Date(),
      'img2',
      PostMother.createRandom().author,
      'music',
    );

    const mockRepo = {
      getAll: vi.fn().mockResolvedValue([blogPost, musicPost]),
    } as unknown as PostRepository;

    const viewModel = new HomeViewModel(mockRepo);

    await new Promise((resolve) => setTimeout(resolve, 10));

    const blogPosts = viewModel.getLatestPosts('blog');
    expect(blogPosts).toHaveLength(1);
    expect(blogPosts[0].section).toBe('blog');

    const musicPosts = viewModel.getLatestPosts('music');
    expect(musicPosts).toHaveLength(1);
    expect(musicPosts[0].section).toBe('music');

    const programmingPosts = viewModel.getLatestPosts('programming');
    expect(programmingPosts).toHaveLength(0);
  });
});
