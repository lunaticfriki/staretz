import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  const Footer({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: const Text(
        'staretz, 2026',
        style: TextStyle(fontSize: 12, color: Colors.black54),
      ),
    );
  }
}
