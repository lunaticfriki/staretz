import 'package:faker/faker.dart';
import 'package:rxdart/rxdart.dart';
import 'package:uuid/uuid.dart';

import '../../domain/entities/post.dart';
import '../../domain/services/read_service.dart';
import '../../domain/value_objects/author.dart';
import '../../domain/value_objects/content.dart';
import '../../domain/value_objects/post_image.dart';
import '../../domain/value_objects/slug.dart';
import '../../domain/value_objects/tag.dart';
import '../../domain/value_objects/title.dart';

class InMemoryReadService implements ReadService {
  final BehaviorSubject<List<Post>> _postsSubject =
      BehaviorSubject<List<Post>>.seeded([]);

  InMemoryReadService() {
    _initSeedData();
  }

  void _initSeedData() {
    final faker = Faker();
    const uuid = Uuid();
    final List<Post> posts = [];

    final possibleTags = ['music', 'videogames', 'philosophy', 'programming'];

    for (int i = 0; i < 20; i++) {
      final title = faker.lorem.sentence();
      final content =
          '''
# ${faker.lorem.sentence()}

${faker.lorem.sentences(5).join(' ')}

![Content Image](${faker.image.image(random: true)})

${faker.lorem.sentences(5).join(' ')}

![Content Image](${faker.image.image(random: true)})

${faker.lorem.sentences(5).join(' ')}

![Content Image](${faker.image.image(random: true)})
''';

      posts.add(
        Post.create(
          id: uuid.v4(),
          title: Title(title),
          author: Author(faker.person.name()),
          createdAt: faker.date.dateTime(minYear: 2023, maxYear: 2026),
          content: Content(content),
          tags: [
            Tag(
              possibleTags[faker.randomGenerator.integer(possibleTags.length)],
            ),
          ],
          slug: Slug(
            title
                .toLowerCase()
                .replaceAll(' ', '-')
                .replaceAll(RegExp(r'[^a-z0-9\-]'), ''),
          ),
          images: [
            PostImage(faker.image.image(random: true), isHero: true),
            PostImage(faker.image.image(random: true)),
            PostImage(faker.image.image(random: true)),
            PostImage(faker.image.image(random: true)),
          ],
        ),
      );
    }

    // Sort by created at descending
    posts.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    _postsSubject.add(posts);
  }

  @override
  Stream<List<Post>> getPosts() => _postsSubject.stream;

  @override
  Stream<Post?> getPost(String id) {
    return _postsSubject.stream.map((posts) {
      try {
        return posts.firstWhere((p) => p.id == id);
      } catch (e) {
        return null;
      }
    });
  }

  void dispose() {
    _postsSubject.close();
  }
}
