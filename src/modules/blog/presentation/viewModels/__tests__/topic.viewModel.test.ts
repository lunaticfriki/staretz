import { describe, it, expect, vi } from 'vitest';
import { TopicViewModel } from '../topic.viewModel';
import { PostStateService } from '../../../application/state.service';
import { Post } from '../../../domain/entities/post';
import { Author } from '../../../domain/valueObjects/author.vo';

describe('TopicViewModel', () => {
  it('should return posts when topic casing differs from URL param', () => {
    const post = Post.create(
      '1',
      'Test Title',
      'Content',
      new Date(),
      new Date(),
      'image.jpg',
      Author.empty(),
      'blog',
      [],
      'Música',
    );

    const service = {
      isLoading: { value: false },
      posts: { value: [post] },
      loadPosts: vi.fn(),
    } as unknown as PostStateService;

    const viewModel = new TopicViewModel(service, 'música');

    expect(viewModel.posts).toHaveLength(1);
    expect(viewModel.posts[0].id).toBe('1');
  });

  it('should return original topic name for display', () => {
    const post = Post.create(
      '1',
      'Test Title',
      'Content',
      new Date(),
      new Date(),
      'image.jpg',
      Author.empty(),
      'blog',
      [],
      'Música',
    );

    const service = {
      isLoading: { value: false },
      posts: { value: [post] },
      loadPosts: vi.fn(),
    } as unknown as PostStateService;

    const viewModel = new TopicViewModel(service, 'música');

    expect(viewModel.topicName).toBe('Música');
  });

  it('should return URL topic name if no posts found', () => {
    const service = {
      isLoading: { value: false },
      posts: { value: [] },
      loadPosts: vi.fn(),
    } as unknown as PostStateService;

    const viewModel = new TopicViewModel(service, 'música');

    expect(viewModel.topicName).toBe('música');
  });
});
