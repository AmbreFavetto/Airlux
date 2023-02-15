import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:app_airlux/models/scenarios/scenario_data.dart';
import '../shared/objectContainer.dart';
import 'add_scenario.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:app_airlux/shared/sockets.dart';

var str;

class AllScenariosPage extends StatefulWidget {
  const AllScenariosPage({super.key});
  @override
  AllScenariosPageState createState() => AllScenariosPageState();
}

class AllScenariosPageState extends State<AllScenariosPage> {
  late IO.Socket socket;
  @override
  void initState() {
    super.initState();
    socket = initSocket();
    connectSocket(socket);
    Provider.of<ScenarioData>(context, listen: false).getAllScenarios();
  }

  @override
  void dispose() {
    socket.disconnect();
    socket.dispose();
    super.dispose();
  }

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
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const AddScenarioPage()))
                      },
                      onSelect: () {},
                      title: scenario.name.toString(),
                      id: scenario.id?.toInt(),
                    );
                  },
                  itemCount: scenarioData.scenarios.length,
                );
              },
            ),
          )
        ],
      ),
    );
  }
}
