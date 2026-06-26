import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';

class PostWriteService {
  final PostRepository _repository;

  PostWriteService(this._repository);

  Future<void> save(Post post) => _repository.save(post);

  Future<void> update(PostSlug originalSlug, Post post) =>
      _repository.update(originalSlug, post);

  Future<void> delete(PostSlug slug) => _repository.delete(slug);
}
