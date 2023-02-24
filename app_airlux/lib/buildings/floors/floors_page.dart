import 'package:app_airlux/models/buildings/rooms/room_data.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:app_airlux/shared/sockets.dart';
import 'package:app_airlux/shared/titlePageStyle.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants.dart';
import '../../models/buildings/floors/floor_data.dart';
import '../../shared/addButton.dart';
import '../../shared/textInformationStyle.dart';
import '../../shared/titleFormStyle.dart';
import 'addFloor_page.dart';
import '../rooms/rooms_page.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class FloorsPage extends StatefulWidget {
  const FloorsPage(
      {super.key, required this.roomId, required this.buildingName});
  final String roomId;
  final String buildingName;

  @override
  State<FloorsPage> createState() => _FloorsPageState();
}

class _FloorsPageState extends State<FloorsPage> {

  late IO.Socket socket;

  void initState() {
    super.initState();
    socket = initSocket();
    connectSocket(socket);
    Provider.of<FloorData>(context, listen: false).getFloorsByBuildingId(widget.roomId);
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
          const SizedBox(width: 10.0, height: 20.0),
          const TitlePageStyle(text: "Étage"),
          const SizedBox(height: 15),
          TextInformationStyle(text: 'Nom du bâtiment : ${widget.buildingName}'),
          Expanded(
            child: Consumer<FloorData>(
              builder: (context, floorData, child) => ListView.builder(
                itemBuilder: (context, index) {
                  final floor = floorData.floors[index];
                  return ObjectContainer(
                    onDelete: () => floorData.deleteFloor(floor),
                    onEdit: () => {
                      Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) => const AddFloorPage()))
                    },
                    onSelect: () {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) {
                          return ChangeNotifierProvider(
                            create: (BuildContext context) => RoomData(),
                            child: MaterialApp(
                              home: RoomsPage(
                                  floorId: floor.id.toString(),
                                  floorNumber: floor.number.toString()),
                            ),
                          );
                        },
                      ));
                    },
                    title: floor.number.toString(),
                    id: floor.id.toString(),
                  );
                },
                itemCount: floorData.floors.length,
              ),
            ),
          )
        ],
      ),
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const AddFloorPage(),
                ));
          },
          title: 'Ajouter un étage'),
    );
  }
}
