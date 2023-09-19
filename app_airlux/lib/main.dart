import 'dart:io';

import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:app_airlux/buildings/rooms/addRoom_page.dart';
import 'package:app_airlux/constants.dart';
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
import 'package:cron/cron.dart';
import 'package:http/http.dart' as http;

void checkApiLocalAvailable() async {
  try {
    final response = await http.get(Uri.parse('${prefixUrl}:${3030.toString()}/health'), headers: header("0"));
    if (await response.statusCode == 200)
      apiIsOnline = true;
    else apiIsOnline = false;
  }
  catch(e){
    apiIsOnline = false;
  }
}

void main() {
  runApp(MyApp());
  var cron = new Cron();
  cron.schedule(new Schedule.parse('* * * * *'), () async {
    checkApiLocalAvailable();
    sleep(22 as Duration);
    print (apiIsOnline);
    //print('every three minutes');
  });
}
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Airlux App',
      debugShowCheckedModeBanner: false,
      initialRoute: '/welcome',
      routes: <String, WidgetBuilder>{
        '/home': (BuildContext context) => HomePage(),
        '/mainPage': (BuildContext context) => ChangeNotifierProvider(
          create: (BuildContext context) => DeviceData(),
          child: MaterialApp(
            home: BottomNavigation(),
          ),),

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
        '/addRoom': (BuildContext context) => AddRoomPage(floor_name: '',floor_id: '',),
        '/buildings': (BuildContext context) => ChangeNotifierProvider(
              create: (BuildContext context) => BuildingData(),
              child: MaterialApp(
              home: BuildingsPage(),
              ),),

        '/scenarios': (BuildContext context) => ChangeNotifierProvider(
          create: (BuildContext context) => ScenarioData(),
          child: ScenariosPage(),
          ),

      },
    );
  }
}
