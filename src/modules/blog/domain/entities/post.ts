import { Author } from '../valueObjects/author.vo';

export class Post {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly image: string,
    public readonly author: Author,
    public readonly section: string,
    public readonly tags: string[],
    public readonly topic: string,
  ) {}

  public static create(
    id: string,
    title: string,
    slug: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    image: string,
    author: Author,
    section: string = 'blog',
    tags: string[] = [],
    topic: string = 'General',
  ) {
    return new Post(
      id,
      title,
      slug,
      content,
      createdAt,
      updatedAt,
      image,
      author,
      section,
      tags,
      topic,
    );
  }

  public static empty() {
    return new Post('', '', '', '', new Date(), new Date(), '', Author.empty(), '', [], '');
  }

  public calculateReadingTime(): number {
    const wordsPerMinute = 200;
    const words = this.content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  public isEmpty() {
    return this.id === '' && this.title === '' && this.content === '';
  }
}
