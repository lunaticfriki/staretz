import 'package:staretz_domain/shared/domain/app_theme.dart';
import 'package:staretz_domain/shared/domain/theme_repository.dart';

class ThemeWriteService {
  final ThemeRepository _repository;

  ThemeWriteService(this._repository);

  Future<void> save(AppTheme theme) => _repository.save(theme);
}
