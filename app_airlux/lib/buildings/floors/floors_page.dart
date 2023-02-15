import 'package:app_airlux/models/buildings/rooms/room_data.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:app_airlux/shared/sockets.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants.dart';
import '../../models/buildings/floors/floor_data.dart';
import 'addFloor_page.dart';
import '../rooms/rooms_page.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class FloorsPage extends StatefulWidget {
  const FloorsPage(
      {super.key, required this.roomId, required this.buildingName});
  final int? roomId;
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
      /*appBar: AppBar(
        backgroundColor: kDarkPurple,
        title: const Text('Étages'),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.of(context).push(MaterialPageRoute(
                builder: (context) => const AddFloorPage(),
              ));
            },
          ),
        ],
      ),*/
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              const SizedBox(width: 15),
              const SizedBox(
                  width: 250,
                  child: Text(
                    'Étages',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: kDarkPurple),
                  )),
              IconButton(
                icon: const Icon(Icons.add, color: kDarkPurple),
                tooltip: 'Ajouter',
                onPressed: () {
                  Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) => const AddFloorPage(),
                  ));
                },
              ),
            ],
          ),
          const SizedBox(height: 15),
          Text('Nom du bâtiment : ${widget.buildingName}',
              style: const TextStyle(color: kDarkPurple)),
          const SizedBox(height: 15),
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
                                  floorId: floor.id?.toInt(),
                                  floorNumber: floor.number?.toInt()),
                            ),
                          );
                        },
                      ));
                    },
                    title: floor.number.toString(),
                    id: floor.id?.toInt(),
                  );
                },
                itemCount: floorData.floors.length,
              ),
            ),
          )
        ],
      ),
    );
  }
}
