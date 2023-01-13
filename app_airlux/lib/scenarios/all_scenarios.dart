import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:app_airlux/models/scenarios/scenario_data.dart';

var str;

class AllScenariosPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Mes Scenarios'),
        ),
        body: Consumer<ScenarioData>(
            builder: (context, scenarioData, child) => ListView.builder(
                  itemBuilder: (context, index) {
                    final scenario = scenarioData.scenarios[index];
                    scenarioData.getAllScenarios();
                    return ScenContainer(
                      scenName: scenario.name.toString(),
                      scenId: scenario.id?.toInt(),
                      onDelete: () => scenarioData.deleteScenario(scenario),
                    );
                  },
                  itemCount: scenarioData.scenarios.length,
                )));
  }
}

class ScenContainer extends StatelessWidget {
  ScenContainer(
      {Key? key,
      required this.scenName,
      required this.scenId,
      required this.onDelete})
      : super(key: key);

  final void Function() onDelete;
  final String scenName;
  final int? scenId;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
            margin: const EdgeInsets.only(left: 10.0, right: 10.0, top: 5.0, bottom: 5.0),
            alignment: Alignment.center,
            decoration: BoxDecoration(
                color: const Color(0xff006991),
                borderRadius: BorderRadius.circular(10),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, offset: Offset(0, 2))
                ]),
            height: 60,
            child: Row(
              children: [
                const SizedBox(width: 15),
                SizedBox(
                    width: 270,
                    child: Text(
                      scenName,
                      textAlign: TextAlign.left,
                      style: const TextStyle(color: Colors.white),
                    )),
                IconButton(
                    icon: const Icon(Icons.edit, color: Colors.white),
                    tooltip: 'Edit',
                    onPressed: () {
                      int a = 0; // Direction : page EDIT scenario
                    }),
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.white),
                  tooltip: 'Delete',
                  onPressed: onDelete,
                ),
              ],
            )),
      ],
    );
  }
}
