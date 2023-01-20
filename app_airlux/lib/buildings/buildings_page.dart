import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/buildings/buildingInfo_page.dart';
import 'package:app_airlux/models/buildings/building_data.dart';
import 'package:app_airlux/shared/addButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class BuildingsPage extends StatefulWidget {
  const BuildingsPage({super.key});
  @override
  BuildingsPageState createState() => BuildingsPageState();
}

class BuildingsPageState extends State<BuildingsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                    onEdit: () => {},
                    onSelect: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const BuildingInfoPage(),
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
