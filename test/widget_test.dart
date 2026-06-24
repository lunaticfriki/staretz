import 'package:flutter_test/flutter_test.dart';

import 'package:staretz/main.dart';

void main() {
  testWidgets('home page shows title', (WidgetTester tester) async {
    await tester.pumpWidget(const StaretzApp());

    expect(find.text('staretz'), findsOneWidget);
  });
}
