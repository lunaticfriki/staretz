import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static final TextTheme _textTheme = GoogleFonts.inconsolataTextTheme();

  static ThemeData get light => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: Color.fromARGB(244, 244, 244, 244),
    colorScheme: const ColorScheme.light(
      primary: Colors.purple,
      secondary: Colors.yellow,
      surface: Color.fromARGB(244, 244, 244, 244),
      onSurface: Colors.black,
    ),
    textTheme: _textTheme,
    appBarTheme: AppBarTheme(
      backgroundColor: Color.fromARGB(244, 244, 244, 244),
      foregroundColor: Colors.black,
      elevation: 0,
      titleTextStyle: _textTheme.titleLarge?.copyWith(
        color: Colors.black,
        fontWeight: FontWeight.bold,
      ),
    ),
  );

  static ThemeData get dark => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: Colors.black,
    colorScheme: const ColorScheme.dark(
      primary: Colors.purple,
      secondary: Colors.yellow,
      surface: Colors.black,
      onSurface: Colors.white,
    ),
    textTheme: _textTheme.apply(
      bodyColor: Colors.white,
      displayColor: Colors.white,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.black,
      foregroundColor: Colors.white,
      elevation: 0,
      titleTextStyle: _textTheme.titleLarge?.copyWith(
        color: Colors.white,
        fontWeight: FontWeight.bold,
      ),
    ),
    cardTheme: CardThemeData(color: Colors.grey[900]),
  );
}
