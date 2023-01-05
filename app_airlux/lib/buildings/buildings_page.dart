import 'package:flutter/material.dart';

class BuildingsPage extends StatelessWidget {
  const BuildingsPage({super.key});
  static const String title = 'Bâtiments';

  @override
  Widget build(BuildContext context) => Scaffold(
    // changer le nom avec la classe qui permet la navigation
    //drawer: NavigationDrawerWidget(),
    appBar: AppBar(
      title: const Text(BuildingsPage.title),
      centerTitle: true,
      backgroundColor: const Color(0x009fc5e8),
    ),
  );
}

class buildPage extends StatefulWidget {
  @override
  _buildPage createState() => _buildPage();
}

class _buildPage extends State<buildPage> {
  @override
  Widget build(BuildContext context) {
    return Column();
  }
}