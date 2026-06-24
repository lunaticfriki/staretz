import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:staretz/di/container.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz/shared/presentation/app_colors.dart';
import 'package:staretz/shared/presentation/app_theme_extension.dart';
import 'package:staretz/shared/presentation/containers/home.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  setupDi();
  runApp(const StaretzApp());
}

class StaretzApp extends StatelessWidget {
  const StaretzApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => GetIt.instance<ThemeStateService>()..load(),
      child: BlocBuilder<ThemeStateService, ThemeState>(
        builder: (_, state) => MaterialApp(
          title: 'staretz',
          themeMode: state.theme.flutterThemeMode,
          theme: ThemeData(
            useMaterial3: true,
            brightness: Brightness.light,
            scaffoldBackgroundColor: AppColors.lightBackground,
            colorScheme: ColorScheme.fromSeed(
              seedColor: Colors.black,
              brightness: Brightness.light,
              surface: AppColors.lightBackground,
            ),
          ),
          darkTheme: ThemeData(
            useMaterial3: true,
            brightness: Brightness.dark,
            scaffoldBackgroundColor: AppColors.darkBackground,
            colorScheme: ColorScheme.fromSeed(
              seedColor: Colors.white,
              brightness: Brightness.dark,
              surface: AppColors.darkBackground,
            ),
          ),
          home: const HomePage(),
          debugShowCheckedModeBanner: false,
        ),
      ),
    );
  }
}
