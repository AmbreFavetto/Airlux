import 'package:app_airlux/models/buildings/rooms/room_data.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/shared/addButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants.dart';
import '../../devices/devices_page.dart';
import '../../widget/hambugerMenu.dart';
import 'addRoom_page.dart';

class RoomsPage extends StatelessWidget {
  const RoomsPage({super.key, required this.floorId, required this.floorNumber});
  final int? floorId;
  final int? floorNumber;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: HamburgerMenuWidget(),
      appBar: AppBar(
        backgroundColor: kFonceyBlue,
        title: const Text('Salles'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 15),
          Text('Numéro étage : $floorNumber',
              style: const TextStyle(color: kFonceyBlue)),
          const SizedBox(height: 15),
          Expanded(
            child: Consumer<RoomData>(
              builder: (context, roomData, child) => ListView.builder(
                itemBuilder: (context, index) {
                  final room = roomData.rooms[index];
                  roomData.getRoomsByFloorId(floorId);
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