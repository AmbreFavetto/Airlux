import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:app_airlux/models/scenarios/scenario_data.dart';
import '../buildings/buildings_page.dart';
import '../constants.dart';
import '../shared/objectContainer.dart';

class AllScenariosPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: Consumer<ScenarioData>(
                builder: (context, scenarioData, child) => ListView.builder(
                      itemBuilder: (context, index) {
                        final scenario = scenarioData.scenarios[index];
                        scenarioData.getAllScenarios();
                        return ObjectContainer(
                          onDelete: () => scenarioData.deleteScenario(scenario),
                          onEdit: () => {
                            Navigator.push(context, MaterialPageRoute(builder: (context) => const AddBuildingPage()))
                          },
                          onSelect: () {},
                          title: scenario.name.toString(),
                          id: scenario.id?.toInt(),
                        );
                      },
                      itemCount: scenarioData.scenarios.length,
                    )),
          )
        ],
      ),
    );
  }
}
