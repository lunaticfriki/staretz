import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz_domain/shared/pagination/paginated.dart';

class PostReadService {
  final PostRepository _repository;

  PostReadService(this._repository);

  Future<List<Post>> getPreview(int limit) => _repository.findPreview(limit);

  Future<Paginated<Post>> getPage(PageCriteria criteria) =>
      _repository.findPage(criteria);

  Future<Post?> getBySlug(PostSlug slug) => _repository.findBySlug(slug);
}
