import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz_domain/shared/pagination/paginated.dart';

abstract class PostRepository {
  Future<List<Post>> findPreview(int limit);
  Future<Paginated<Post>> findPage(PageCriteria criteria);
  Future<Post?> findBySlug(PostSlug slug);
  Future<void> save(Post post);
  Future<void> update(PostSlug originalSlug, Post updatedPost);
  Future<void> delete(PostSlug slug);
}
