import 'package:flutter/material.dart';
import 'package:staretz/shared/presentation/containers/home.dart';

void main() {
  runApp(const StaretzApp());
}

class StaretzApp extends StatelessWidget {
  const StaretzApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'staretz',
      home: HomePage(),
      debugShowCheckedModeBanner: false,
    );
  }
}
