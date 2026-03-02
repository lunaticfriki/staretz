import 'package:faker/faker.dart';
import 'package:uuid/uuid.dart';

import 'package:staretz/domain/entities/post.dart';
import 'package:staretz/domain/value_objects/author.dart';
import 'package:staretz/domain/value_objects/content.dart';
import 'package:staretz/domain/value_objects/post_image.dart';
import 'package:staretz/domain/value_objects/slug.dart';
import 'package:staretz/domain/value_objects/tag.dart';
import 'package:staretz/domain/value_objects/title.dart';

class PostMother {
  static Post create({
    String? id,
    Title? title,
    Author? author,
    DateTime? createdAt,
    Content? content,
    List<Tag>? tags,
    Slug? slug,
    List<PostImage>? images,
  }) {
    final faker = Faker();
    const uuid = Uuid();

    return Post.create(
      id: id ?? uuid.v4(),
      title: title ?? Title(faker.lorem.sentence()),
      author: author ?? Author(faker.person.name()),
      createdAt: createdAt ?? faker.date.dateTime(minYear: 2023, maxYear: 2026),
      content: content ?? Content(faker.lorem.sentences(5).join(' ')),
      tags: tags ?? [Tag('test')],
      slug: slug ?? Slug('test-slug'),
      images:
          images ?? [PostImage('https://example.com/image.jpg', isHero: true)],
    );
  }

  static Post empty() {
    return Post.empty();
  }
}
