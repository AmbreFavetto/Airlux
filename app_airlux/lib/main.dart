import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/buildings/buildingInfo_page.dart';
import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:app_airlux/buildings/rooms/addRoom_page.dart';
import 'package:app_airlux/models/buildings/building_data.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/models/signup/signup_data.dart';
import 'package:app_airlux/models/user/user_data.dart';
import 'package:app_airlux/pages/home_page.dart';
import 'package:app_airlux/pages/login_page.dart';
import 'package:app_airlux/pages/signup_page.dart';
import 'package:app_airlux/pages/welcome_page.dart';
import 'package:app_airlux/pages/cgu_page.dart';
import 'package:app_airlux/scenarios/scenarios_page.dart';
import 'package:app_airlux/widget/bottomNavigation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'buildings/floors/addFloor_page.dart';
import 'models/scenarios/scenario_data.dart';

void main() {
  runApp(MyApp());
}
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Airlux App',
      initialRoute: '/welcome',
      routes: <String, WidgetBuilder>{
        '/home': (BuildContext context) => HomePage(),
        '/mainPage': (BuildContext context) => ChangeNotifierProvider(
          create: (BuildContext context) => DeviceData(),
          child: BottomNavigation(),
          ),

        '/welcome': (BuildContext context) => WelcomePage(),
        '/signup': (BuildContext context) => ChangeNotifierProvider(
          create: (BuildContext context) => SignupData(),
          child: SignupPage(),
          ),

        '/login': (BuildContext context) => ChangeNotifierProvider(
          create: (BuildContext context) => UserData(),
          child: LoginPage(),
          ),

        '/cgu': (BuildContext context) => CguPage(),
        '/addBuilding': (BuildContext context) => AddBuildingPage(),
        '/addFloor': (BuildContext context) => AddFloorPage(building_id: '', building_name: '',),
        '/infos': (BuildContext context) => BuildingInfoPage(),
        '/addRoom': (BuildContext context) => AddRoomPage(floor_name: '',floor_id: '',),
        '/buildings': (BuildContext context) => ChangeNotifierProvider(
              create: (BuildContext context) => BuildingData(),
              child: BuildingsPage(),
              ),

        '/scenarios': (BuildContext context) => ChangeNotifierProvider(
          create: (BuildContext context) => ScenarioData(),
          child: ScenariosPage(),
          ),

      },
    );
  }
}
