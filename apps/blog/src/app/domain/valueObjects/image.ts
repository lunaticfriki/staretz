export class Image {
  private constructor(private readonly image: string) {}

  public static create(image: string) {
    return new Image(image);
  }

  public static empty() {
    return new Image('');
  }

  public getValue() {
    return this.image;
  }

  public isEmpty() {
    return this.image === '';
  }

  public equals(other: Image) {
    return this.image === other.image;
  }
}
