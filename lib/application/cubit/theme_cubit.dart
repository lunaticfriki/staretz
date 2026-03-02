import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/services/theme_service.dart';
import 'theme_state.dart';

class ThemeCubit extends Cubit<ThemeState> {
  final ThemeService _themeService;
  StreamSubscription? _themeSubscription;

  ThemeCubit(this._themeService) : super(const ThemeInitial(false)) {
    _loadTheme();
  }

  void _loadTheme() {
    _themeSubscription = _themeService.isDarkMode.listen((isDark) {
      emit(ThemeLoaded(isDark));
    });
  }

  Future<void> toggleTheme() async {
    await _themeService.toggleTheme();
  }

  @override
  Future<void> close() {
    _themeSubscription?.cancel();
    return super.close();
  }
}
