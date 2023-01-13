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
                    scenarioData.getAllScenarios2();
                    return ScenContainer(
                        scenName: scenarioData.scenarios[index].name.toString(),
                        scenId: scenarioData.scenarios[index].id?.toInt());
                  },
                  itemCount: scenarioData.scenarios.length,
                )));
  }
}

class ScenContainer extends StatelessWidget {
  const ScenContainer({Key? key, required this.scenName, required this.scenId})
      : super(key: key);

  final String scenName;
  final int? scenId;
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 10,
        ),
        Container(
            margin: const EdgeInsets.only(left: 10.0, right: 10.0),
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
                    onPressed: () {
                      print(scenId);
                      //deleteScen();

                      //int id = str['data']['buildings']['building_id'][scenId];
                      //print(id);
                      // Delete scenario
                    }),
              ],
            )),
      ],
    );
  }
}
