import 'package:flutter/material.dart';
import 'package:staretz/shared/presentation/widgets/footer.dart';
import 'package:staretz/shared/presentation/widgets/header.dart';
import 'package:staretz/shared/presentation/widgets/home_content.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool _showMain = false;
  double _opacity = 1.0;
  Duration _animDuration = const Duration(milliseconds: 60);

  @override
  void initState() {
    super.initState();
    _runIntro();
  }

  Future<void> _runIntro() async {
    await Future.delayed(const Duration(milliseconds: 1500));
    setState(() => _opacity = 0.0);
    await Future.delayed(const Duration(milliseconds: 70));
    setState(() => _opacity = 1.0);
    await Future.delayed(const Duration(milliseconds: 70));
    setState(() => _opacity = 0.0);
    await Future.delayed(const Duration(milliseconds: 70));
    setState(() {
      _animDuration = const Duration(milliseconds: 200);
      _showMain = true;
      _opacity = 1.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedOpacity(
        opacity: _opacity,
        duration: _animDuration,
        child: _showMain ? const _MainLayout() : const _Splash(),
      ),
    );
  }
}

class _Splash extends StatelessWidget {
  const _Splash();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('staretz', style: TextStyle(fontSize: 48)),
    );
  }
}

class _MainLayout extends StatelessWidget {
  const _MainLayout();

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        Header(),
        Expanded(child: HomeContent()),
        Footer(),
      ],
    );
  }
}
