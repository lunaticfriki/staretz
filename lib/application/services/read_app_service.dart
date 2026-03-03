import '../../domain/entities/post.dart';
import '../../domain/services/read_service.dart';

class ReadAppService {
  final ReadService _readService;

  ReadAppService(this._readService);

  Stream<List<Post>> getPosts({String? tag}) => _readService.getPosts(tag: tag);
}
