import 'package:app_airlux/models/buildings/rooms/room_data.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/shared/addButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../devices/devices_page.dart';
import 'addRoom_page.dart';

class RoomsPage extends StatelessWidget {
  const RoomsPage({super.key, required this.id, required this.floorNumber});
  final int? id;
  final int? floorNumber;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Salles'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 15),
          Text('Numéro étage : $floorNumber',
              style: const TextStyle(color: Color(0xFF003b71))),
          const SizedBox(height: 15),
          Expanded(
            child: Consumer<RoomData>(
              builder: (context, roomData, child) => ListView.builder(
                itemBuilder: (context, index) {
                  final room = roomData.rooms[index];
                  roomData.getRoomsByFloorId(id);
                  return ObjectContainer(
                    onDelete: () => roomData.deleteRoom(room),
                    onEdit: () => {},
                    onSelect: () {
                      Navigator.push(context, MaterialPageRoute(
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
            Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AddRoomPage(),
                ));
          },
          title: 'Ajouter une salle'),
    );
  }
}
