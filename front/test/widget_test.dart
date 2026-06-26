import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:staretz/di/container.dart';
import 'package:staretz/main.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/ports/post_repository.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/shared/pagination/page_criteria.dart';
import 'package:staretz_domain/shared/pagination/paginated.dart';

class _FakePostRepository implements PostRepository {
  @override
  Future<List<Post>> findPreview(int limit) async => [];
  @override
  Future<Paginated<Post>> findPage(PageCriteria criteria) async =>
      Paginated(items: [], totalCount: 0, criteria: criteria);
  @override
  Future<Post?> findBySlug(PostSlug slug) async => null;
  @override
  Future<void> save(Post post) async {}
  @override
  Future<void> update(PostSlug originalSlug, Post updatedPost) async {}
  @override
  Future<void> delete(PostSlug slug) async {}
}

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await GetIt.instance.reset();
    setupDi(postRepository: _FakePostRepository());
  });

  testWidgets('splash shows staretz title', (tester) async {
    await tester.pumpWidget(const StaretzApp());

    expect(find.text('staretz'), findsWidgets);

    await tester.pump(const Duration(milliseconds: 1000));
    await tester.pump(const Duration(milliseconds: 250));
    await tester.pump(const Duration(milliseconds: 250));
    await tester.pump(const Duration(milliseconds: 250));
    await tester.pumpAndSettle();
  });

  testWidgets('after intro, main layout shows header, footer and home content', (tester) async {
    await tester.pumpWidget(const StaretzApp());

    await tester.pump(const Duration(milliseconds: 1000));
    await tester.pump(const Duration(milliseconds: 250));
    await tester.pump(const Duration(milliseconds: 250));
    await tester.pump(const Duration(milliseconds: 250));
    await tester.pumpAndSettle();

    expect(find.byType(Image), findsWidgets);
    expect(find.text('staretz, 2026', findRichText: true), findsOneWidget);
  });
}
