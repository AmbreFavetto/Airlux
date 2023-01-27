import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:app_airlux/constants.dart';
import 'package:app_airlux/models/buildings/building_data.dart';
import 'package:app_airlux/models/scenarios/scenario_data.dart';
import 'package:app_airlux/scenarios/all_scenarios.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../main.dart';

class HamburgerMenuWidget extends StatelessWidget {
  final padding = EdgeInsets.symmetric(horizontal: 20);
  static int currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Drawer(
        child: Material(
            color: kLightBlue,
            child: ListView(
              padding: padding,
              children: <Widget>[
                const SizedBox(height: 60),
                buildMenuItem(
                  text: 'Accueil',
                  icon: Icons.home,
                  onClicked: () => selectedItem(context, 0),
                ),
                const SizedBox(height: 20),
                buildMenuItem(
                  text: 'Bâtiments',
                  icon: Icons.business,
                  onClicked: () => selectedItem(context, 1),
                ),
                const SizedBox(height: 20),
                buildMenuItem(
                  text: 'Scénarios',
                  icon: Icons.movie,
                  onClicked: () => selectedItem(context, 2),
                ),
                const SizedBox(height: 24),
                Divider(color: Colors.white70)
              ],
            )));
  }

  Widget buildMenuItem({
    required String text,
    required IconData icon,
    VoidCallback? onClicked,
  }) {
    final color = Colors.black;
    final hoverColor = Colors.white70;

    return ListTile(
      leading: Icon(icon, color: color),
      title: Text(text, style: TextStyle(color: color)),
      hoverColor: hoverColor,
      onTap: onClicked,
    );
  }

  void selectedItem(BuildContext context, int index) {
    Navigator.of(context).pop();

    switch (index) {
      case 0:
        Navigator.of(context).push(MaterialPageRoute(
          builder: (context) => MyApp(),
        ));
        currentPage = 0;
        break;
      case 1:
        Navigator.push(context, MaterialPageRoute(
          builder: (context) {
            return ChangeNotifierProvider(
              create: (BuildContext context) => BuildingData(),
              child: const MaterialApp(
                home: BuildingsPage(),
              ),
            );
          },
        ));
        currentPage = 1;
        break;
      case 2:
        Navigator.push(context, MaterialPageRoute(
          builder: (context) {
            return ChangeNotifierProvider(
              create: (BuildContext context) => ScenarioData(),
              child: MaterialApp(
                home: AllScenariosPage(),
              ),
            );
          },
        ));
        currentPage = 2;
        break;
    }
  }
}
