import 'package:app_airlux/models/buildings/floors/floor_data.dart';
import 'package:app_airlux/models/buildings/rooms/room_data.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:app_airlux/shared/sockets.dart';
import 'package:app_airlux/shared/titlePageStyle.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants.dart';
import '../../devices/devices_page.dart';
import '../../shared/addButton.dart';
import '../../shared/textInformationStyle.dart';
import '../../shared/titleFormStyle.dart';
import 'addRoom_page.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class RoomsPage extends StatefulWidget {
  const RoomsPage({super.key, required this.floorId, required this.floorNumber});
  final int? floorId;
  final int? floorNumber;

  @override
  State<RoomsPage> createState() => _RoomsPageState();
}

class _RoomsPageState extends State<RoomsPage> {

  late IO.Socket socket;

  void initState() {
    super.initState();
    socket = initSocket();
    connectSocket(socket);
    Provider.of<RoomData>(context, listen: false).getRoomsByFloorId(widget.floorId);
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
          const TitlePageStyle(text: "Salles"),
          const SizedBox(height: 15),
          TextInformationStyle(text: 'Numéro étage : ${widget.floorNumber}'),
          Expanded(
            child: Consumer<RoomData>(
              builder: (context, roomData, child) => ListView.builder(
                itemBuilder: (context, index) {
                  final room = roomData.rooms[index];
                  return ObjectContainer(
                    onDelete: () => roomData.deleteRoom(room),
                    onEdit: () => {
                      Navigator.of(context).push(MaterialPageRoute(builder: (context) => const AddRoomPage()))
                    },
                    onSelect: () {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) {
                          return ChangeNotifierProvider(
                            create: (BuildContext context) => DeviceData(),
                            child: MaterialApp(
                              home: DevicesPage(id: room.id?.toInt(), name: room.name),
                            ),
                          );
                        },
                      ));
                    },
                    title: room.name.toString(),
                    id: room.id?.toInt(),
                  );
                },
                itemCount: roomData.rooms.length,
              ),
            ),
          )
        ],
      ),
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const AddRoomPage(),
                ));
          },
          title: 'Ajouter une salle'),
    );
  }
}
