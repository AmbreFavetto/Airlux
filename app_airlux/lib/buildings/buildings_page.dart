import 'package:flutter/material.dart';

class BuildingsPage extends StatefulWidget {
  const BuildingsPage({super.key});
  @override
  BuildingsPageState createState() => BuildingsPageState();
}

class BuildingsPageState extends State<BuildingsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Batiments'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('Page des batiments'),
        ],
      ),
    );
  }
}
