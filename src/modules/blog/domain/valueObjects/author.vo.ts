export class Author {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly avatar: string,
  ) {}

  public static create(name: string, email: string, avatar: string) {
    return new Author(name, email, avatar);
  }

  public static empty() {
    return new Author('', '', '');
  }
}
