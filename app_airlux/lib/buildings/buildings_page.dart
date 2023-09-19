import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/buildings/floors/floors_page.dart';
import 'package:app_airlux/constants.dart';
import 'package:app_airlux/models/buildings/building_data.dart';
import 'package:app_airlux/shared/downButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants.dart';
import '../models/buildings/building.dart';
import '../models/buildings/floors/floor_data.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:http/http.dart' as http;
import '../shared/addButton.dart';
import 'package:cron/cron.dart';


class BuildingsPage extends StatefulWidget {
  BuildingsPage({super.key});
  @override
  State<BuildingsPage> createState() => _BuildingsPageState();
}

class _BuildingsPageState extends State<BuildingsPage> {
  TextEditingController _editBuildingNameController = TextEditingController();
  void initState() {
    Provider.of<BuildingData>(context, listen: false).getBuildingsByUser();
  }
  var cron = new Cron();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded(
            child: Consumer<BuildingData>(
              builder: (context, buildingData, child) => GridView.builder(
                shrinkWrap: true,
                padding: const EdgeInsets.all(20),
                itemCount: buildingData.buildings.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                ),
                itemBuilder: (context, index) {
                  final building = buildingData.buildings[index];
                  return ObjectContainer(
                    icon: Icons.business,
                    onDelete: () => {
                      buildingData.deleteBuilding(building),
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Bâtiment supprimé.'),
                        ),
                      )
                    },
                    onEdit: () => {
                      _editBuilding(context, building, buildingData),
                    },
                    onSelect: () {
                      // print(ModalRoute.of(context)?.settings);
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) {
                          return ChangeNotifierProvider(
                            create: (BuildContext context) => FloorData(),
                            child: MaterialApp(
                              debugShowCheckedModeBanner: false,
                              home: FloorsPage(
                                  buildingId: building.id.toString(),
                                  buildingName: building.name.toString()),
                            ),
                          );
                        },
                      ));
                      currentBuildingId = building.id.toString();
                      currentBuildingName = building.name.toString();
                    },
                    title: building.name.toString(),
                    id: building.id.toString(),
                  );
                },
              ),
            ),
          )
        ],
      ),
      floatingActionButton: addButton(),
    );
  }

  Widget addButton(){
    if (apiIsOnline == true) {
      return AddButton(
        onTap: () {
          Navigator.of(context).push(MaterialPageRoute(
            builder: (context) => ChangeNotifierProvider(
              create: (BuildContext context) => BuildingData(),
              child: const AddBuildingPage(),
              ),
          ));
        },
        title: 'Ajouter un bâtiment');
    } else {
      return const DownButton();
    }
  }

  _editBuilding(BuildContext context, Building building,
      BuildingData buildingData) async {
    setState(() {
      _editBuildingNameController.text = building.name ?? 'No name';
    });
    _editFormDialog(context, building, buildingData);
  }

  _editFormDialog(
      BuildContext context, Building building, BuildingData buildingData) {
    return showDialog(
      context: context,
      barrierDismissible: true,
      builder: (param) {
        return AlertDialog(
            actions: <Widget>[
              TextButton(
                onPressed: () async {
                  http.Response response = await buildingData.updateBuilding(
                      _editBuildingNameController.text, building);
                  if (response.statusCode == 200) {
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => BuildingsPage()));
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('La mise à jour n\'a pas pu aboutir.'),
                      ),
                    );
                  }
                },
                child: const Text(
                  'Mettre à jour',
                  style: TextStyle(color: kDarkPurple),
                ),
              ),
            ],
            title: const Text('Modifier un bâtiment'),
            content: SingleChildScrollView(
                child: Column(children: <Widget>[
              TextField(
                controller: _editBuildingNameController,
                decoration: const InputDecoration(
                    hintText: 'Nom', labelText: 'Nom du bâtiment'),
              )
            ])));
      },
    );
  }
}
