import { faker } from '@faker-js/faker';
import { Author } from '../../valueObjects/author.vo';

export class AuthorMother {
  public static createWithData(name: string, email = 'test@example.com', avatar = 'avatar.jpg') {
    return Author.create(name, email, avatar);
  }

  public static createEmpty() {
    return Author.empty();
  }

  public static createRandom() {
    return Author.create(faker.person.firstName(), faker.internet.email(), faker.image.avatar());
  }
}
