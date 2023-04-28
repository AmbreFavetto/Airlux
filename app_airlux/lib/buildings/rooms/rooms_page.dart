import 'package:app_airlux/models/buildings/rooms/room_data.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:app_airlux/shared/titlePageStyle.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../devices/devices_page.dart';
import '../../shared/addButton.dart';
import '../../shared/textInformationStyle.dart';
import 'addRoom_page.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class RoomsPage extends StatefulWidget {
  const RoomsPage(
      {super.key, required this.floorId, required this.floorNumber});
  final String floorId;
  final String floorNumber;

  @override
  State<RoomsPage> createState() => _RoomsPageState();
}

class _RoomsPageState extends State<RoomsPage> {
  //late IO.Socket socket;

  void initState() {
    //super.initState();
    //socket = initSocket();
    //connectSocket(socket);
    Provider.of<RoomData>(context, listen: false)
        .getRoomsByFloorId(widget.floorId);
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
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitlePageStyle(text: "Salles"),
          const SizedBox(height: 15),
          TextInformationStyle(text: 'Numéro étage : ${widget.floorNumber}'),
          Expanded(
            child: Consumer<RoomData>(
              builder: (context, roomData, child) => GridView.builder(
                shrinkWrap: true,
                padding: const EdgeInsets.all(20),
                itemCount: roomData.rooms.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                ),
                itemBuilder: (context, index) {
                  final room = roomData.rooms[index];
                  return ObjectContainer(
                    icon: Icons.chair,
                    onDelete: () => {
                      roomData.deleteRoom(room),
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Salle supprimée.'),
                        ),
                      )
                    },
                    onEdit: () => {
                      Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) => const AddRoomPage()))
                    },
                    onSelect: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) {
                            return ChangeNotifierProvider(
                              create: (BuildContext context) => DeviceData(),
                              child: MaterialApp(
                                home: DevicesPage(
                                    id: room.id.toString(),
                                    name: room.name.toString()),
                              ),
                            );
                          },
                        ),
                      );
                    },
                    title: room.name.toString(),
                    id: room.id.toString(),
                  );
                },
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => const AddRoomPage(),
              ),
            );
          },
          title: 'Ajouter une salle'),
    );
  }
}
