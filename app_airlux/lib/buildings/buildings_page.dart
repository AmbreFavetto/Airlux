import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/buildings/floors/floors_page.dart';
import 'package:app_airlux/models/buildings/building_data.dart';
import 'package:app_airlux/shared/addButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:app_airlux/widget/hambugerMenu.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/buildings/floors/floor_data.dart';

class BuildingsPage extends StatelessWidget {
  const BuildingsPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: HamburgerMenuWidget(),
      appBar: AppBar(
        title: const Text('Batiments'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded(
            child: Consumer<BuildingData>(
              builder: (context, buildingData, child) => ListView.builder(
                itemBuilder: (context, index) {
                  final building = buildingData.buildings[index];
                  buildingData.getAllBuildings();
                  return ObjectContainer(
                    onDelete: () => buildingData.deleteBuilding(building),
                    onEdit: () => {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const AddBuildingPage()))
                    },
                    onSelect: () {
                      Navigator.push(context, MaterialPageRoute(
                        builder: (context) {
                          return ChangeNotifierProvider(
                            create: (BuildContext context) => FloorData(),
                            child: MaterialApp(
                              home: FloorsPage(roomId: building.id?.toInt(), buildingName: building.name.toString()),
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
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AddBuildingPage(),
                ));
          },
          title: 'Ajouter un batiment'),
    );
  }
}
