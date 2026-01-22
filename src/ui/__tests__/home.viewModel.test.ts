import { HomeViewModel } from '../viewModels/home.viewModel';
import { PostStateService } from '../../modules/blog/application/state.service';
import { PostMother } from '../../modules/blog/domain/__tests__/mothers/post.mother';
import { vi, describe, it, expect } from 'vitest';
import { signal } from '@preact/signals';

describe('HomeViewModel', () => {
  it('should load posts on initialization', async () => {
    const mockStateService = {
      loadPosts: vi.fn(),
      posts: signal([]),
      isLoading: signal(false),
    } as unknown as PostStateService;

    new HomeViewModel(mockStateService);

    expect(mockStateService.loadPosts).toHaveBeenCalled();
  });

  it('should filter posts by section', async () => {
    const blogPost = PostMother.createWithData(
      '1',
      't1',
      'slug-1',
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
      'slug-2',
      'c2',
      new Date(),
      new Date(),
      'img2',
      PostMother.createRandom().author,
      'music',
    );

    const mockStateService = {
      loadPosts: vi.fn(),
      posts: signal([blogPost, musicPost]),
      isLoading: signal(false),
    } as unknown as PostStateService;

    const viewModel = new HomeViewModel(mockStateService);

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
