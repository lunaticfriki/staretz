import '../../domain/services/write_service.dart';

class InMemoryWriteService implements WriteService {
  // In a real application, this would persist the comment somewhere.
  // For now, we will just simulate a network delay.

  @override
  Future<void> addComment(String postId, String comment) async {
    await Future.delayed(const Duration(milliseconds: 500));
    // Simulation logic (Adding comments isn't explicitly supported in the Entity model yet
    // based on the requirements, but the service is present for Firebase preparation)
  }
}
