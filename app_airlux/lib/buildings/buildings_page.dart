import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/buildings/floors/floors_page.dart';
import 'package:app_airlux/models/buildings/building_data.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:app_airlux/shared/sockets.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/buildings/floors/floor_data.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class BuildingsPage extends StatefulWidget {
  const BuildingsPage({super.key});

  @override
  State<BuildingsPage> createState() => _BuildingsPageState();
}

class _BuildingsPageState extends State<BuildingsPage> {
  late IO.Socket socket;

  void initState() {
    super.initState();
    socket = initSocket();
    connectSocket(socket);
    Provider.of<BuildingData>(context, listen: false).getAllBuildings();
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
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded(
            child: Consumer<BuildingData>(
              builder: (context, buildingData, child) => ListView.builder(
                itemBuilder: (context, index) {
                  final building = buildingData.buildings[index];
                  return ObjectContainer(
                    onDelete: () => buildingData.deleteBuilding(building),
                    onEdit: () => {
                      Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) => const AddBuildingPage()))
                    },
                    onSelect: () {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) {
                          return ChangeNotifierProvider(
                            create: (BuildContext context) => FloorData(),
                            child: MaterialApp(
                              home: FloorsPage(
                                  roomId: building.id?.toInt(),
                                  buildingName: building.name.toString()),
                            ),
                          );
                        },
                      ));
                    },
                    title: building.name.toString(),
                    id: building.id?.toInt(),
                  );
                },
                itemCount: buildingData.buildings.length,
              ),
            ),
          )
        ],
      ),
    );
  }
}
