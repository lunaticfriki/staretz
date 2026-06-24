import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:staretz/di/container.dart';
import 'package:staretz/main.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await GetIt.instance.reset();
    setupDi(postsData: const []);
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
