import 'package:equatable/equatable.dart';
import '../value_objects/title.dart';
import '../value_objects/author.dart';
import '../value_objects/content.dart';
import '../value_objects/tag.dart';
import '../value_objects/slug.dart';
import '../value_objects/post_image.dart';

class Post extends Equatable {
  final String id;
  final Title title;
  final Author author;
  final DateTime createdAt;
  final Content content;
  final List<Tag> tags;
  final Slug slug;
  final List<PostImage> images;

  const Post._({
    required this.id,
    required this.title,
    required this.author,
    required this.createdAt,
    required this.content,
    required this.tags,
    required this.slug,
    required this.images,
  });

  factory Post.create({
    required String id,
    required Title title,
    required Author author,
    required DateTime createdAt,
    required Content content,
    required List<Tag> tags,
    required Slug slug,
    required List<PostImage> images,
  }) {
    return Post._(
      id: id,
      title: title,
      author: author,
      createdAt: createdAt,
      content: content,
      tags: tags,
      slug: slug,
      images: images,
    );
  }

  factory Post.empty() {
    return Post._(
      id: '',
      title: const Title(''),
      author: const Author(''),
      createdAt: DateTime.now(),
      content: const Content(''),
      tags: const [],
      slug: const Slug(''),
      images: const [],
    );
  }

  @override
  List<Object?> get props => [
    id,
    title,
    author,
    createdAt,
    content,
    tags,
    slug,
    images,
  ];
}
