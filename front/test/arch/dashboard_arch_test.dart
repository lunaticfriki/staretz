import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

List<String> findDartFiles(String dir) => Directory(dir)
    .listSync(recursive: true)
    .whereType<File>()
    .where((f) => f.path.endsWith('.dart'))
    .map((f) => f.path)
    .toList();

List<String> readImports(String filePath) => File(filePath)
    .readAsLinesSync()
    .where((l) => l.trimLeft().startsWith('import '))
    .toList();

void main() {
  group('Dashboard arch', () {
    test('application does not import infrastructure or presentation', () {
      for (final file in findDartFiles('lib/dashboard/application')) {
        final imports = readImports(file);
        expect(imports, everyElement(isNot(contains('/infrastructure/'))),
            reason: file);
        expect(imports, everyElement(isNot(contains('/presentation/'))),
            reason: file);
      }
    });

    test('presentation does not import infrastructure', () {
      for (final file in findDartFiles('lib/dashboard/presentation')) {
        final imports = readImports(file);
        expect(imports, everyElement(isNot(contains('/infrastructure/'))),
            reason: file);
      }
    });

    test('state services follow naming convention', () {
      final files = findDartFiles('lib/dashboard')
          .where((f) => f.contains('state_service'));
      for (final file in files) {
        expect(file, endsWith('.state_service.dart'), reason: file);
      }
    });

    test('containers follow naming convention', () {
      final files = findDartFiles('lib/dashboard/presentation')
          .where((f) => f.contains('container'));
      for (final file in files) {
        expect(file, endsWith('.container.dart'), reason: file);
      }
    });
  });
}
