export class Title {
  private constructor(private readonly title: string) {}

  public static create(title: string) {
    return new Title(title);
  }

  public static empty() {
    return new Title('');
  }

  public getValue() {
    return this.title;
  }

  public isEmpty() {
    return this.title === '';
  }

  public equals(other: Title) {
    return this.title === other.title;
  }
}
