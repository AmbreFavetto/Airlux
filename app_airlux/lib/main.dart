import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/buildings/buildingInfo_page.dart';
import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:app_airlux/buildings/floors/addFloor_page.dart';
import 'package:app_airlux/buildings/rooms/addRoom_page.dart';
import 'package:app_airlux/pages/home_page.dart';
import 'package:app_airlux/pages/login_page.dart';
import 'package:app_airlux/pages/welcome_page.dart';
import 'package:app_airlux/scenarios/all_scenarios.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'models/buildings/building_data.dart';
import 'models/scenarios/scenario_data.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Airlux App',
      initialRoute: '/welcome',
      routes: <String, WidgetBuilder>{
        '/home': (BuildContext context) => const HomePage(),
        '/welcome': (BuildContext context) => WelcomePage(),
        '/login': (BuildContext context) => LoginPage(),
        '/addBuilding': (BuildContext context) => AddBuildingPage(),
        '/addFloor': (BuildContext context) => AddFloorPage(),
        '/infos': (BuildContext context) => BuildingInfoPage(),
        '/addRoom': (BuildContext context) => AddRoomPage(),
        '/buildings': (BuildContext context) => ChangeNotifierProvider(
              create: (BuildContext context) => BuildingData(),
              child: const MaterialApp(
                home: BuildingsPage(),
              ),
            ),
        '/scenarios': (BuildContext context) => ChangeNotifierProvider(
          create: (BuildContext context) => ScenarioData(),
          child: MaterialApp(
            home: AllScenariosPage(),
          ),
        ),
      },
    );
  }
}
