import { PostMother } from '../mothers/post.mother';
import { AuthorMother } from '../mothers/author.vo.mother';

describe('Post tests', () => {
  it('should create a post', () => {
    const post = PostMother.createRandom();
    expect(post).toBeDefined();
  });

  it('should create a Post with data', () => {
    const post = PostMother.createWithData(
      'id-1',
      'title-1',
      'content-1',
      new Date(),
      new Date(),
      'image-1',
      AuthorMother.createWithData('Rodia'),
    );
    expect(post).toBeDefined();
    expect(post.id).toBe('id-1');
    expect(post.title).toBe('title-1');
    expect(post.content).toBe('content-1');
    expect(post.createdAt).toBeInstanceOf(Date);
    expect(post.updatedAt).toBeInstanceOf(Date);
    expect(post.image).toBe('image-1');
    expect(post.author.name).toBe('Rodia');
  });

  it('should create an empty post', () => {
    const post = PostMother.createEmpty();
    expect(post).toBeDefined();
    expect(post.id).toBe('');
    expect(post.title).toBe('');
    expect(post.content).toBe('');
    expect(post.createdAt).toBeInstanceOf(Date);
    expect(post.updatedAt).toBeInstanceOf(Date);
    expect(post.image).toBe('');
    expect(post.author.name).toBe('');
  });

  it('should create a random post', () => {
    const post = PostMother.createRandom();
    expect(post).toBeDefined();
  });
});
