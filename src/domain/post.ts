export class Post {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly authorId: string,
  ) {}
}
