import 'package:app_airlux/constants.dart';
import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';

class BottomNavigation extends StatelessWidget {
  final padding = EdgeInsets.symmetric(horizontal: 20);

  @override
  Widget build(BuildContext context) {
    return GNav(
        backgroundColor: kDarkPurple,
        color: Colors.white,
        activeColor: Colors.white,
        tabBackgroundColor: Colors.grey,
        gap: 8,
        tabs: [
          GButton(
            icon: Icons.home,
            text: 'Accueil',
            onPressed: () {
              //Navigator.pop(context);
              Navigator.of(context, rootNavigator: true).pushNamed('/home');
            },
          ),
          GButton(
            icon: Icons.business,
            text: 'Bâtiments',
            onPressed: () {
              //Navigator.pop(context);
              Navigator.of(context, rootNavigator: true)
                  .pushNamed('/buildings');
            },
          ),
          GButton(
            icon: Icons.movie,
            text: 'Scénarios',
            onPressed: () {
              //Navigator.pop(context);
              Navigator.of(context, rootNavigator: true)
                  .pushNamed('/scenarios');
            },
          ),
        ]);
  }
}
