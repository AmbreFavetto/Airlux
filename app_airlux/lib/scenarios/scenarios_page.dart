import 'dart:async';

import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/models/scenarios/scenario.dart';
import 'package:app_airlux/scenarios/addScenario_page.dart';
import 'package:app_airlux/scenarios/configureScenario_page.dart';
import 'package:app_airlux/shared/addButton.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:app_airlux/models/scenarios/scenario_data.dart';
import '../shared/objectContainer.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:app_airlux/shared/sockets.dart';

var str;

class ScenariosPage extends StatefulWidget {
  const ScenariosPage({super.key});
  @override
  ScenariosPageState createState() => ScenariosPageState();
}

class ScenariosPageState extends State<ScenariosPage> {
  //late IO.Socket socket;
  //bool socketState = false;
  late Future<bool> response;

  @override
  void initState() {
    super.initState();
    //socket = initSocket();
    //connectSocket(socket);
    //socket.on('updated_scenarioList', );
    Provider.of<ScenarioData>(context, listen: false).getAllScenarios();
  }

  //@override
  //void dispose() {
  //  socket.disconnect();
  //  socket.dispose();
  //  super.dispose();
  //}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: Consumer<ScenarioData>(
              builder: (context, scenarioData, child) {
                return GridView.builder(
                    shrinkWrap: true,
                    padding: const EdgeInsets.all(20),
                    itemCount: scenarioData.scenarios.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                    ),
                    itemBuilder: (context, index) {
                      final scenario =
                          Provider.of<ScenarioData>(context, listen: false)
                              .scenarios[index];
                      return ObjectContainer(
                        icon: Icons.movie,
                        onDelete: () async => {
                          response =
                              Provider.of<ScenarioData>(context, listen: false)
                                  .deleteScenario(scenario),
                          if (await response)
                            {
                              Provider.of<ScenarioData>(context, listen: false)
                                  .getAllScenarios(),
                            }
                          else
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Impossible de supprimer'),
                              ),
                            )
                        },
                        onEdit: () => {
                          Navigator.of(context).push(MaterialPageRoute(
                            builder: (context) =>
                                ConfigureScenarioPage(scenario: scenario),
                          )),
                        },
                        onSelect: () {
                          //TODO active le scenario
                        },
                        title: scenario.name.toString(),
                        id: scenario.id.toString(),
                      );
                    });
              },
            ),
          )
        ],
      ),
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => const AddScenarioPage(),
            ));
          },
          title: 'Ajouter un batiment'),
    );
  }
}
