import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:get_it/get_it.dart';
import 'package:staretz/di/container.dart';
import 'package:staretz/router.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz/shared/presentation/app_colors.dart';
import 'package:staretz/shared/presentation/app_theme_extension.dart';

const _postsPath = 'lib/blog/infrastructure/posts';

void main() async {
  usePathUrlStrategy();
  WidgetsFlutterBinding.ensureInitialized();
  setupDi(rawPosts: await _loadRawPosts());
  runApp(const StaretzApp());
}

Future<Map<String, String>> _loadRawPosts() async {
  final manifestRaw = await rootBundle.loadString('$_postsPath/manifest.json');
  final slugs = (jsonDecode(manifestRaw) as List).cast<String>();
  final contents = await Future.wait(
    slugs.map((s) => rootBundle.loadString('$_postsPath/$s.md')),
  );
  return Map.fromIterables(slugs, contents);
}

class StaretzApp extends StatelessWidget {
  const StaretzApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => GetIt.instance<ThemeStateService>()..load(),
      child: BlocBuilder<ThemeStateService, ThemeState>(
        builder: (_, state) => MaterialApp.router(
          routerConfig: appRouter,
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
          debugShowCheckedModeBanner: false,
        ),
      ),
    );
  }
}
