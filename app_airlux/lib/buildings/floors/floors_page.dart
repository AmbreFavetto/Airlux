import 'package:app_airlux/models/buildings/building_data.dart';
import 'package:app_airlux/models/buildings/floors/floor.dart';
import 'package:app_airlux/models/buildings/rooms/room_data.dart';
import 'package:app_airlux/shared/downButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:app_airlux/shared/sockets.dart';
import 'package:app_airlux/shared/titlePageStyle.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants.dart';
import '../../models/buildings/floors/floor_data.dart';
import '../../shared/addButton.dart';
import '../../shared/textInformationStyle.dart';
import '../buildings_page.dart';
import 'addFloor_page.dart';
import '../rooms/rooms_page.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:http/http.dart' as http;

class FloorsPage extends StatefulWidget {
  const FloorsPage(
      {super.key, required this.buildingId, required this.buildingName});
  final String buildingId;
  final String buildingName;

  @override
  State<FloorsPage> createState() => _FloorsPageState();
}

class _FloorsPageState extends State<FloorsPage> {
  //late IO.Socket socket;
  TextEditingController _editFloorNameController = TextEditingController();
  void initState() {
    Provider.of<FloorData>(context, listen: false)
        .getFloorsByBuildingId(widget.buildingId);
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          IconButton(
            onPressed: () => {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) {
                    return ChangeNotifierProvider(
                      create: (BuildContext context) => RoomData(),
                      child: MaterialApp(
                        home: BuildingsPage(),
                      ),
                    );
                  },
                ),
              ),
            },
            icon: const Icon(Icons.arrow_back),
          ),
          const SizedBox(width: 10.0, height: 20.0),
          const TitlePageStyle(text: "Étages"),
          const SizedBox(height: 15),
          TextInformationStyle(
              text: "Batiment : ${widget.buildingName}"),
          Expanded(
            child: Consumer<FloorData>(
              builder: (context, floorData, child) => GridView.builder(
                shrinkWrap: true,
                padding: const EdgeInsets.all(20),
                itemCount: floorData.floors.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                ),
                itemBuilder: (context, index) {
                  final floor = floorData.floors[index];
                  return ObjectContainer(
                    icon: Icons.stairs_outlined,
                    onDelete: () async => {
                      if ((await floorData.deleteFloor(
                          floor)).statusCode == 200) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Etage supprimé'),
                          ),
                        ),
                        Navigator.of(context).push(MaterialPageRoute(
                            builder: (context) => FloorsPage(
                              buildingId: widget.buildingId,
                              buildingName: widget.buildingName,
                            )))
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('La supression de l\'étage n\'a pu aboutir.'),
                          ),
                        )
                      }},
                    onEdit: () => _editFloor(context, floor, floorData),
                    onSelect: () {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) {
                          return ChangeNotifierProvider(
                            create: (BuildContext context) => RoomData(),
                            child: MaterialApp(
                              home: RoomsPage(
                                  floorId: floor.id.toString(),
                                  floorNumber: floor.name.toString()),
                            ),
                          );
                        },
                      ));
                      currentFloorId = floor.id.toString();
                      currentFloorName = floor.name.toString();
                    },
                    title: floor.name.toString(),
                    id: floor.id.toString(),
                  );
                },
              ),
            ),
          )
        ],
      ),
      floatingActionButton: addButton(widget.buildingId, widget.buildingName),
    );
  }

  Widget addButton(String building_id, String building_name){
    if (apiIsOnline == true) {
      return AddButton(
          onTap: () {
            Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => ChangeNotifierProvider(
                create: (BuildContext context) => FloorData(),
                child: AddFloorPage(building_id: building_id, building_name: building_name),
              ),

            ));
          },
          title: 'Ajouter un étage');
    } else {
      return const DownButton();
    }
  }

  _editFloor(BuildContext context, Floor floor, FloorData floorData) async {
    setState(() {
      _editFloorNameController.text = floor.name ?? 'No name';
    });
    _editFormDialog(context, floor, floorData);
  }

  _editFormDialog(BuildContext context, Floor floor, FloorData floorData) {
    return showDialog(
      context: context,
      barrierDismissible: true,
      builder: (param) {
        return AlertDialog(
            actions: <Widget>[
              TextButton(
                onPressed: () async {
                  http.Response response = await floorData.updateFloor(
                      _editFloorNameController.text, floor);
                  print(response.statusCode);
                  if ((response.statusCode == 201) || (response.statusCode == 200)) {
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => FloorsPage(
                          buildingId: widget.buildingId,
                          buildingName: widget.buildingName,
                        )));
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
            title: const Text('Modifier un étage'),
            content: SingleChildScrollView(
                child: Column(children: <Widget>[
                  TextField(
                    controller: _editFloorNameController,
                    decoration: const InputDecoration(
                        hintText: 'Etage', labelText: "Numéro de l'étage"),
                  )
                ])));
      },
    );
  }
}
