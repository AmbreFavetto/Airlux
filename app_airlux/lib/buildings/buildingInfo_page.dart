import 'package:flutter/material.dart';

class BuildingInfoPage extends StatelessWidget {
  const BuildingInfoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Informations du bâtiment'),
        ),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [Text('Informations du bâtiment')],
        ));
  }
}
