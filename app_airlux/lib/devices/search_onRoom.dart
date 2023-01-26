import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;

import '../buildings/buildings_page.dart';
import '../models/devices/room_data.dart';

var str;

class SearchOnRoom extends StatelessWidget {
  const SearchOnRoom({super.key, required this.idF, required this.idB});

  final int? idB;
  final int? idF;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("2 - Dans les pièces de l'étage " + idF.toString()),
      ),
      body: Consumer<RoomData>(
          builder: (context, roomData, child) => Align(
              alignment: Alignment.topCenter,
              child: ListView.builder(
                reverse: true,
                shrinkWrap: true,
                itemBuilder: (context, index) {
                  final room = roomData.rooms[index];
                  roomData.getRoomsFromFloor(idF, idB);
                  return RoomContainer(
                    roomFloorId: room.floor_id,
                    roomName: room.name,
                    roomId: room.id?.toInt(),
                  );
                },
                itemCount: roomData.rooms.length,
              ))),
    );
  }
}

class RoomContainer extends StatelessWidget {
  RoomContainer(
      {Key? key,
      required this.roomFloorId,
      required this.roomName,
      required this.roomId})
      : super(key: key);

  final int? roomFloorId;
  final String? roomName;
  final int? roomId;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: () {
            print("Container clicked");
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
                        roomName.toString(),
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
