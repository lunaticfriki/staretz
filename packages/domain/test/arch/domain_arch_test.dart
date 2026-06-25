import 'dart:io';

import 'package:test/test.dart';

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
  group('Domain arch', () {
    test('domain files do not import flutter', () {
      for (final file in findDartFiles('lib')) {
        final imports = readImports(file);
        expect(imports, everyElement(isNot(contains('package:flutter'))),
            reason: file);
      }
    });

    test('domain files do not import application or infrastructure', () {
      for (final file in findDartFiles('lib')) {
        final imports = readImports(file);
        expect(imports, everyElement(isNot(contains('/application/'))),
            reason: file);
        expect(imports, everyElement(isNot(contains('/infrastructure/'))),
            reason: file);
      }
    });
  });
}
