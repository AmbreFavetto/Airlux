import 'package:flutter/material.dart';
import '../constants.dart';

import '../widget/hambugerMenu.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        drawer: HamburgerMenuWidget(),
        appBar: AppBar(
          backgroundColor: kFonceyBlue,
          title: const Text('Accueil'),
          actions: [
            Hero(
              tag: 'cottage',
              child: Container(
                margin: EdgeInsets.only(right: 15.0),
                child: Icon(
                  Icons.cottage,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [Text('Bienvenue user')],
        ));
  }
}
