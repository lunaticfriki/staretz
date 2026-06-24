import 'package:staretz/shared/domain/app_theme.dart';
import 'package:staretz/shared/domain/theme_repository.dart';

class ThemeReadService {
  final ThemeRepository _repository;

  ThemeReadService(this._repository);

  Future<AppTheme?> getSaved() => _repository.load();
}
