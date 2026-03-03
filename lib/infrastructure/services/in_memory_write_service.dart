import '../../domain/services/write_service.dart';

class InMemoryWriteService implements WriteService {
  @override
  Future<void> addComment(String postId, String comment) async {
    await Future.delayed(const Duration(seconds: 1));
  }
}
