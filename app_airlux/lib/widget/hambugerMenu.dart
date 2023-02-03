import 'package:app_airlux/constants.dart';
import 'package:flutter/material.dart';

class HamburgerMenuWidget extends StatelessWidget {
  final padding = EdgeInsets.symmetric(horizontal: 20);

  @override
  Widget build(BuildContext context) {
    return Drawer(
        child: Material(
            color: kLightBlue,
            child: ListView(
              padding: padding,
              children: <Widget>[
                const SizedBox(height: 60),
                ListTile(
                  leading: Icon(Icons.home, color: kFonceyBlue),
                  title: const Text('Accueil'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.of(context, rootNavigator: true).pushNamed('/home');
                  },
                ),
                const SizedBox(height: 20),
                ListTile(
                  leading: Icon(Icons.business, color: kFonceyBlue),
                  title: const Text('Bâtiments'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.of(context, rootNavigator: true).pushNamed('/buildings');
                  },
                ),
                const SizedBox(height: 20),
                ListTile(
                  leading: Icon(Icons.movie, color: kFonceyBlue),
                  title: const Text('Scénarios'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.of(context, rootNavigator: true).pushNamed('/scenarios');
                  },
                ),
                const SizedBox(height: 24),
                Divider(color: Colors.white70)
              ],
            )));
  }
}
