import 'package:flutter/material.dart';

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

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          'staretz',
          style: TextStyle(fontSize: 48),
        ),
      ),
    );
  }
}
