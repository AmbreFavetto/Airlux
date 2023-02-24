import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/scenarios/addScenario_page.dart';
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
  bool socketState = false;

  @override
  void initState() {
    super.initState();
    //socket = initSocket();
    //connectSocket(socket);
    Provider.of<ScenarioData>(context, listen: false).getAllScenarios();
  }

  @override
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
                return ListView.builder(
                  itemBuilder: (context, index) {
                    final scenario = scenarioData.scenarios[index];
                    return ObjectContainer(
                      onDelete: () => scenarioData.deleteScenario(scenario),
                      onEdit: () => {
                        //TODO
                      },
                      onSelect: () {},
                      title: scenario.name.toString(),
                      id: scenario.id.toString(),
                    );
                  },
                  itemCount: scenarioData.scenarios.length,
                );
              },
            ),
          )
        ],
      ),
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const AddScenarioPage(),
                ));
          },
          title: 'Ajouter un batiment'),
    );

  }
}
