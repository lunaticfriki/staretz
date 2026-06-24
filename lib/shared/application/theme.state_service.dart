import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:staretz/shared/application/theme.read_service.dart';
import 'package:staretz/shared/application/theme.write_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz/shared/domain/app_theme.dart';

class ThemeStateService extends Cubit<ThemeState> {
  final ThemeReadService _read;
  final ThemeWriteService _write;

  ThemeStateService(this._read, this._write) : super(ThemeState.initial());

  Future<void> load() async {
    final saved = await _read.getSaved();
    if (saved != null) emit(state.copyWith(theme: saved));
  }

  Future<void> toggle() => _setTheme(state.theme.next);

  Future<void> _setTheme(AppTheme theme) async {
    await _write.save(theme);
    emit(state.copyWith(theme: theme));
  }
}
