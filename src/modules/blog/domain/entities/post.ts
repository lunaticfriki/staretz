import { Author } from '../valueObjects/author.vo';

export class Post {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly image: string,
    public readonly author: Author,
  ) {}

  public static create(
    id: string,
    title: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    image: string,
    author: Author,
  ) {
    return new Post(id, title, content, createdAt, updatedAt, image, author);
  }

  public static empty() {
    return new Post('', '', '', new Date(), new Date(), '', Author.empty());
  }

  public isEmpty() {
    return this.id === '' && this.title === '' && this.content === '';
  }
}
