import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import '../models/devices/floor_data.dart';

import '../buildings/buildings_page.dart';
import '../models/buildings/building_data.dart';
import 'search_onFloor.dart';

var str;

class SearchOnBuildingPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('1 - Dans les batiments '),
      ),
      body: Consumer<BuildingData>(
          builder: (context, buildingData, child) => Align(
              alignment: Alignment.topCenter,
              child: ListView.builder(
                reverse: true,
                shrinkWrap: true,
                itemBuilder: (context, index) {
                  final building = buildingData.buildings[index];
                  buildingData.getAllBuildings();
                  return BuildContainer(
                    buildName: building.name.toString(),
                    buildId: building.id?.toInt(),
                  );
                },
                itemCount: buildingData.buildings.length,
              ))),
    );
  }
}

class BuildContainer extends StatelessWidget {
  BuildContainer({Key? key, required this.buildName, required this.buildId})
      : super(key: key);

  final String buildName;
  final int? buildId;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) {
                print(buildId);
                return ChangeNotifierProvider(
                  create: (BuildContext context) => FloorData(),
                  child: MaterialApp(
                    home: SearchOnFloor(
                      id: buildId,
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
                        buildName,
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
