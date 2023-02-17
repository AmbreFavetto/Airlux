import 'package:flutter/material.dart';

import '../widget/appBarBuilder.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        //mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          AppBarBuilder(),
          Text('Bienvenue user'),
        ],
      ),
    );
  }
}
