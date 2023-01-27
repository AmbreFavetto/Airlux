import 'package:app_airlux/buildings/buildingInfo_page.dart';
import 'package:app_airlux/shared/addButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/buildings/floors/floor_data.dart';
import 'addFloor_page.dart';

class FloorsPage extends StatelessWidget {
  const FloorsPage({super.key, required this.id});
  final int? id;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Floors'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
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
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const BuildingInfoPage(),
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
