import 'package:faker/faker.dart';
import 'package:flutter/services.dart';
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

  Future<void> _initSeedData() async {
    final faker = Faker();
    const uuid = Uuid();
    final List<Post> posts = [];

    final possibleTags = [
      'music',
      'videogames',
      'philosophy',
      'programming',
      'japan',
    ];

    final templates = [
      await rootBundle.loadString('assets/seed/posts/template_1.mdx'),
      await rootBundle.loadString('assets/seed/posts/template_2.mdx'),
      await rootBundle.loadString('assets/seed/posts/template_3.mdx'),
    ];

    for (int i = 0; i < 20; i++) {
      final title = faker.lorem.sentence();
      final authorName = faker.person.name();

      String templateContent = templates[i % templates.length];

      String content = templateContent
          .replaceAll('{{title}}', faker.lorem.sentence())
          .replaceAll('{{sentence_1}}', faker.lorem.sentence())
          .replaceAll('{{sentence_2}}', faker.lorem.sentence())
          .replaceAll('{{sentence_3}}', faker.lorem.sentence())
          .replaceAll('{{sentence_4}}', faker.lorem.sentence())
          .replaceAll('{{paragraph_1}}', faker.lorem.sentences(25).join(' '))
          .replaceAll('{{paragraph_2}}', faker.lorem.sentences(30).join(' '))
          .replaceAll('{{paragraph_3}}', faker.lorem.sentences(20).join(' '))
          .replaceAll('{{paragraph_4}}', faker.lorem.sentences(35).join(' '))
          .replaceAll('{{words_1}}', faker.lorem.words(4).join(' '))
          .replaceAll('{{words_2}}', faker.lorem.words(3).join(' '))
          .replaceAll('{{image_1}}', faker.image.loremPicsum())
          .replaceAll('{{image_2}}', faker.image.loremPicsum())
          .replaceAll('{{image_3}}', faker.image.loremPicsum())
          .replaceAll('{{author}}', authorName);

      posts.add(
        Post.create(
          id: uuid.v4(),
          title: Title(title),
          author: Author(authorName),
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
            PostImage(faker.image.loremPicsum(), isHero: true),
            PostImage(faker.image.loremPicsum()),
            PostImage(faker.image.loremPicsum()),
            PostImage(faker.image.loremPicsum()),
          ],
        ),
      );
    }

    posts.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    _postsSubject.add(posts);
  }

  @override
  Stream<List<Post>> getPosts({String? tag}) {
    if (tag == null) {
      return _postsSubject.stream;
    }
    return _postsSubject.stream.map(
      (posts) => posts.where((p) => p.tags.any((t) => t.value == tag)).toList(),
    );
  }

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
