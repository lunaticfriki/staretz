import { Content } from '../valueObjects/content';
import { Image } from '../valueObjects/image';
import { Title } from '../valueObjects/title';

export class Post {
  private constructor(
    private readonly id: string,
    private title: Title,
    private content: Content,
    private image: Image
  ) {}

  public static create(
    id: string,
    title: Title,
    content: Content,
    image: Image
  ) {
    return new Post(id, title, content, image);
  }

  public static empty() {
    return new Post('', Title.empty(), Content.empty(), Image.empty());
  }

  public getValue() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      image: this.image,
    };
  }

  public equals(other: Post) {
    return (
      this.id === other.id &&
      this.title.equals(other.title) &&
      this.content.equals(other.content) &&
      this.image.equals(other.image)
    );
  }

  public update({
    title,
    content,
    image,
  }: {
    title: Title;
    content: Content;
    image: Image;
  }) {
    this.title = title;
    this.content = content;
    this.image = image;
  }
}
