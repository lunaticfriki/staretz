import 'package:staretz/blog/domain/entities/post.dart';
import 'package:staretz/blog/domain/value_objects/post_slug.dart';
import 'package:staretz/shared/pagination/page_criteria.dart';
import 'package:staretz/shared/pagination/paginated.dart';

abstract class PostRepository {
  Future<List<Post>> findPreview(int limit);
  Future<Paginated<Post>> findPage(PageCriteria criteria);
  Future<Post?> findBySlug(PostSlug slug);
}
