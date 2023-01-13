import 'package:app_airlux/models/scenarios/scenario_data.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'scenarios/all_scenarios.dart';
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (BuildContext context) => ScenarioData(),
      child: MaterialApp(
        home: AllScenariosPage(),
      ),
    );
  }
}
