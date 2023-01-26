import 'package:app_airlux/devices/search_onRoom.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;

import '../buildings/buildings_page.dart';
import '../models/devices/floor_data.dart';
import '../models/devices/room_data.dart';
var str;

class SearchOnFloor extends StatelessWidget {
  const SearchOnFloor({super.key, required this.id});

  final int? id;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('2 - Dans les étages du bâtiment ' + id.toString()),
      ),
      body: Consumer<FloorData>(
          builder: (context, floorData, child) => Align(
              alignment: Alignment.topCenter,
              child: ListView.builder(
                reverse: true,
                shrinkWrap: true,
                itemBuilder: (context, index) {
                  final floor = floorData.floors[index];
                  floorData.getFloorsFromBuilding(id);
                  return FloorContainer(
                    floorBuildingId: floor.building_id,
                    floorName: floor.number,
                    floorId: floor.id?.toInt(),
                  );
                },
                itemCount: floorData.floors.length,
              ))),
    );
  }
}

class FloorContainer extends StatelessWidget {
  FloorContainer(
      {Key? key,
      required this.floorBuildingId,
      required this.floorName,
      required this.floorId})
      : super(key: key);

  final int? floorBuildingId;
  final int? floorName;
  final int? floorId;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) {
                print(floorId);
                return ChangeNotifierProvider(
                  create: (BuildContext context) => RoomData(),
                  child: MaterialApp(
                    home: SearchOnRoom(
                        idF: floorId,
                      idB: floorBuildingId
                    ),
                  ),
                );
              },
            ));
          },
          child: Container(
              margin: const EdgeInsets.only(
                  left: 10.0, right: 10.0, top: 5.0, bottom: 5.0),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                  color: const Color(0xff006991),
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: const [
                    BoxShadow(color: Colors.black26, offset: Offset(0, 2))
                  ]),
              height: 60,
              child: Row(
                children: [
                  const SizedBox(width: 15),
                  SizedBox(
                      width: 270,
                      child: Text(
                        floorName.toString(),
                        textAlign: TextAlign.left,
                        style: const TextStyle(color: Colors.white),
                      )),
                ],
              )),
        ),
      ],
    );
  }
}
