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
  group('Back arch', () {
    test('application does not import infrastructure', () {
      for (final file in findDartFiles('lib/blog/application')) {
        final imports = readImports(file);
        expect(imports, everyElement(isNot(contains('/infrastructure/'))),
            reason: file);
      }
    });

    test('read services follow naming convention', () {
      final files = findDartFiles('lib/blog/application')
          .where((f) => f.contains('read_service'));
      for (final file in files) {
        expect(file, endsWith('.read_service.dart'), reason: file);
      }
    });

    test('write services follow naming convention', () {
      final files = findDartFiles('lib/blog/application')
          .where((f) => f.contains('write_service'));
      for (final file in files) {
        expect(file, endsWith('.write_service.dart'), reason: file);
      }
    });
  });
}
