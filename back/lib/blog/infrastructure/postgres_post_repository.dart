import 'package:postgres/postgres.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_body.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_id.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_title.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz_domain/shared/pagination/paginated.dart';

class PostgresPostRepository implements PostRepository {
  final Connection _db;

  PostgresPostRepository(this._db);

  @override
  Future<List<Post>> findPreview(int limit) async {
    final result = await _db.execute(
      Sql.named(
        'SELECT id, title, slug, image_url, excerpt, body, published_at '
        'FROM posts ORDER BY published_at DESC LIMIT @limit',
      ),
      parameters: {'limit': limit},
    );
    return result.map(_rowToPost).toList();
  }

  @override
  Future<Paginated<Post>> findPage(PageCriteria criteria) async {
    final countResult = await _db.execute('SELECT COUNT(*) FROM posts');
    final total = countResult.first.first as int;

    final result = await _db.execute(
      Sql.named(
        'SELECT id, title, slug, image_url, excerpt, body, published_at '
        'FROM posts ORDER BY published_at DESC '
        'LIMIT @limit OFFSET @offset',
      ),
      parameters: {
        'limit': criteria.pageSize,
        'offset': criteria.offset,
      },
    );
    return Paginated(
      items: result.map(_rowToPost).toList(),
      totalCount: total,
      criteria: criteria,
    );
  }

  @override
  Future<Post?> findBySlug(PostSlug slug) async {
    final result = await _db.execute(
      Sql.named(
        'SELECT id, title, slug, image_url, excerpt, body, published_at '
        'FROM posts WHERE slug = @slug',
      ),
      parameters: {'slug': slug.value},
    );
    if (result.isEmpty) return null;
    return _rowToPost(result.first);
  }

  @override
  Future<void> save(Post post) async {
    await _db.execute(
      Sql.named(
        'INSERT INTO posts (id, title, slug, image_url, excerpt, body, published_at) '
        'VALUES (@id, @title, @slug, @imageUrl, @excerpt, @body, @publishedAt) '
        'ON CONFLICT (id) DO UPDATE SET '
        'title = EXCLUDED.title, slug = EXCLUDED.slug, '
        'image_url = EXCLUDED.image_url, excerpt = EXCLUDED.excerpt, '
        'body = EXCLUDED.body, published_at = EXCLUDED.published_at',
      ),
      parameters: {
        'id': post.id.value,
        'title': post.title.value,
        'slug': post.slug.value,
        'imageUrl': post.imageUrl.value,
        'excerpt': post.excerpt.value,
        'body': post.body.value,
        'publishedAt': post.publishedAt.value,
      },
    );
  }

  @override
  Future<void> update(PostSlug originalSlug, Post updatedPost) async {
    await _db.execute(
      Sql.named(
        'UPDATE posts SET title=@title, slug=@slug, image_url=@imageUrl, '
        'excerpt=@excerpt, body=@body '
        'WHERE slug=@originalSlug',
      ),
      parameters: {
        'originalSlug': originalSlug.value,
        'title': updatedPost.title.value,
        'slug': updatedPost.slug.value,
        'imageUrl': updatedPost.imageUrl.value,
        'excerpt': updatedPost.excerpt.value,
        'body': updatedPost.body.value,
      },
    );
  }

  @override
  Future<void> delete(PostSlug slug) async {
    await _db.execute(
      Sql.named('DELETE FROM posts WHERE slug = @slug'),
      parameters: {'slug': slug.value},
    );
  }

  Post _rowToPost(ResultRow row) => Post.create(
        id: PostId.create(row[0] as String),
        title: PostTitle.create(row[1] as String),
        slug: PostSlug.create(row[2] as String),
        imageUrl: PostImageUrl.create(row[3] as String),
        excerpt: PostExcerpt.create(row[4] as String),
        body: PostBody.create(row[5] as String),
        publishedAt:
            PostPublishedAt.create((row[6] as DateTime).toUtc()),
      );
}
