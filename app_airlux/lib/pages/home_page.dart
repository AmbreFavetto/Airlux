import 'package:flutter/material.dart';
import '../constants.dart';
import '../widget/bottomNavigation.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: BottomNavigation(),
      appBar: AppBar(
        backgroundColor: kDarkPurple,
        title: const Text('Accueil'),
        actions: [
          Hero(
            tag: 'cottage',
            child: Container(
              margin: const EdgeInsets.only(right: 15.0),
              child: const Icon(
                Icons.cottage,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Text('Bienvenue user'),
        ],
      ),
    );
  }
}
