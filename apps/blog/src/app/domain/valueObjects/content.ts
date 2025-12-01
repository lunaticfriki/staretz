export class Content {
  private constructor(private readonly content: string) {}

  public static create(content: string) {
    return new Content(content);
  }

  public static empty() {
    return new Content('');
  }

  public getValue() {
    return this.content;
  }

  public isEmpty() {
    return this.content === '';
  }

  public equals(other: Content) {
    return this.content === other.content;
  }
}
