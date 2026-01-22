import { PostMother } from '../mothers/post.mother';
import { AuthorMother } from '../mothers/author.vo.mother';
import { Post } from '../../entities/post';
import { Author } from '../../valueObjects/author.vo';

describe('Post tests', () => {
  it('should create a post', () => {
    const post = PostMother.createRandom();
    expect(post).toBeDefined();
  });

  it('should create a Post with data', () => {
    const post = PostMother.createWithData(
      'id-1',
      'title-1',
      'slug-1',
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
    expect(post.section).toBe('blog');
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
    expect(post.section).toBe('');
  });

  it('should create a random post', () => {
    const post = PostMother.createRandom();
    expect(post).toBeDefined();
  });

  describe('calculateReadingTime', () => {
    it('should return 1 minute for empty content', () => {
      const post = Post.create(
        'id',
        'title',
        'slug',
        '',
        new Date(),
        new Date(),
        'image',
        Author.empty(),
      );
      expect(post.calculateReadingTime()).toBe(1);
    });

    it('should return 1 minute for short content', () => {
      const post = Post.create(
        'id',
        'title',
        'slug',
        'word '.repeat(100),
        new Date(),
        new Date(),
        'image',
        Author.empty(),
      );
      expect(post.calculateReadingTime()).toBe(1);
    });

    it('should calculate correct minutes for longer content', () => {
      const post = Post.create(
        'id',
        'title',
        'slug',
        'word '.repeat(400),
        new Date(),
        new Date(),
        'image',
        Author.empty(),
      );
      // 400 words / 200 wpm = 2 minutes
      expect(post.calculateReadingTime()).toBe(2);
    });
  });
});
