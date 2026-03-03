import '../../domain/services/write_service.dart';

class WriteAppService {
  final WriteService _writeService;

  WriteAppService(this._writeService);

  Future<void> addComment(String postId, String comment) async {
    await _writeService.addComment(postId, comment);
  }
}
