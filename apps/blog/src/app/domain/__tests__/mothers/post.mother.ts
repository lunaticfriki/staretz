import { Post } from '../../entities/post';
import { Title } from '../../valueObjects/title';
import { Content } from '../../valueObjects/content';
import { Image } from '../../valueObjects/image';

import { faker } from '@faker-js/faker';

export class PostMother {
  public static createRandom() {
    return Post.create(
      faker.string.uuid(),
      Title.create(faker.lorem.sentence()),
      Content.create(faker.lorem.paragraph()),
      Image.create(faker.image.url())
    );
  }

  public static createEmpty() {
    return Post.create(
      faker.string.uuid(),
      Title.create(''),
      Content.create(''),
      Image.create('')
    );
  }

  public static createWithData(data: {
    id: string;
    title: string;
    content: string;
    image: string;
  }) {
    return Post.create(
      data.id,
      Title.create(data.title),
      Content.create(data.content),
      Image.create(data.image)
    );
  }

  public static createWithId(id: string) {
    return Post.create(
      id,
      Title.create('title'),
      Content.create('content'),
      Image.create('image')
    );
  }

  public static createWithTitle(title: string) {
    return Post.create(
      faker.string.uuid(),
      Title.create(title),
      Content.create('content'),
      Image.create('image')
    );
  }

  public static createWithContent(content: string) {
    return Post.create(
      faker.string.uuid(),
      Title.create('title'),
      Content.create(content),
      Image.create('image')
    );
  }

  public static createWithImage(image: string) {
    return Post.create(
      faker.string.uuid(),
      Title.create('title'),
      Content.create('content'),
      Image.create(image)
    );
  }
}
