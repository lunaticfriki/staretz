import 'package:rxdart/rxdart.dart';
import '../../domain/entities/post.dart';
import '../../domain/services/state_service.dart';

class InMemoryStateService implements StateService {
  final BehaviorSubject<Post?> _selectedPostSubject =
      BehaviorSubject<Post?>.seeded(null);

  @override
  Stream<Post?> get selectedPost => _selectedPostSubject.stream;

  @override
  void selectPost(Post post) {
    _selectedPostSubject.add(post);
  }

  @override
  void clearSelection() {
    _selectedPostSubject.add(null);
  }

  void dispose() {
    _selectedPostSubject.close();
  }
}
