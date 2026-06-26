import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:staretz/blog/presentation/containers/home_preview.container.dart';
import 'package:staretz/shared/application/theme.state_service.dart';
import 'package:staretz/shared/application/theme_state.dart';
import 'package:staretz/shared/presentation/widgets/footer.dart';
import 'package:staretz/shared/presentation/widgets/header.dart';

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
    await Future.delayed(const Duration(milliseconds: 1000));
    setState(() => _opacity = 0.0);
    await Future.delayed(const Duration(milliseconds: 250));
    setState(() => _opacity = 1.0);
    await Future.delayed(const Duration(milliseconds: 250));
    setState(() => _opacity = 0.0);
    await Future.delayed(const Duration(milliseconds: 250));
    setState(() {
      _animDuration = const Duration(milliseconds: 600);
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
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final asset = isDark
        ? 'assets/images/logo-face-black.jpg'
        : 'assets/images/logo-face-white.jpg';
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 650, maxHeight: 650),
        child: Image.asset(asset, fit: BoxFit.contain),
      ),
    );
  }
}

class _FaceBackground extends StatelessWidget {
  const _FaceBackground();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final asset = isDark
        ? 'assets/images/logo-face-black.jpg'
        : 'assets/images/logo-face-white.jpg';
    final overlayColor = Theme.of(
      context,
    ).scaffoldBackgroundColor.withValues(alpha: 0.75);

    return Stack(
      fit: StackFit.expand,
      children: [
        Center(
          child: FractionallySizedBox(
            widthFactor: 0.4,
            child: Image.asset(asset, fit: BoxFit.contain),
          ),
        ),
        ColoredBox(color: overlayColor),
      ],
    );
  }
}

class _MainLayout extends StatelessWidget {
  const _MainLayout();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeStateService, ThemeState>(
      builder: (context, state) => LayoutBuilder(
        builder: (context, constraints) => Stack(
          fit: StackFit.expand,
          children: [
            const _FaceBackground(),
            SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Header(
                      currentTheme: state.theme,
                      onToggle: () =>
                          context.read<ThemeStateService>().toggle(),
                    ),
                    const HomePreviewContainer(),
                    const Footer(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
