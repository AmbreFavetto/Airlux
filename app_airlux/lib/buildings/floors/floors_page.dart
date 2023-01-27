import 'package:app_airlux/models/buildings/rooms/room_data.dart';
import 'package:app_airlux/shared/addButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/buildings/floors/floor_data.dart';
import 'addFloor_page.dart';
import '../rooms/rooms_page.dart';

class FloorsPage extends StatelessWidget {
  const FloorsPage({super.key, required this.id, required this.buildingName});
  final int? id;
  final String buildingName;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Étages'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 15),
          Text('Nom du bâtiment : $buildingName',
              style: const TextStyle(color: Color(0xFF003b71))),
          const SizedBox(height: 15),
          Expanded(
            child: Consumer<FloorData>(
              builder: (context, floorData, child) => ListView.builder(
                itemBuilder: (context, index) {
                  final floor = floorData.floors[index];
                  floorData.getFloorsByBuildingId(id);
                  return ObjectContainer(
                    onDelete: () => floorData.deleteFloor(floor),
                    onEdit: () => {},
                    onSelect: () {
                      Navigator.push(context, MaterialPageRoute(
                        builder: (context) {
                          return ChangeNotifierProvider(
                            create: (BuildContext context) => RoomData(),
                            child: MaterialApp(
                              home: RoomsPage(id: floor.id?.toInt(), floorNumber: floor.number?.toInt()),
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
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AddFloorPage(),
                ));
          },
          title: 'Ajouter un étage'),
    );
  }
}
