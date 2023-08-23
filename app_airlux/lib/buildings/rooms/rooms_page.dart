import 'dart:io';

import 'package:app_airlux/constants.dart';
import 'package:app_airlux/models/buildings/rooms/room.dart';
import 'package:app_airlux/models/buildings/rooms/room_data.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:app_airlux/shared/titlePageStyle.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../devices/devices_page.dart';
import '../../shared/addButton.dart';
import '../../shared/textInformationStyle.dart';
import 'addRoom_page.dart';
import 'package:http/http.dart' as http;
import 'package:socket_io_client/socket_io_client.dart' as IO;

class RoomsPage extends StatefulWidget {
  const RoomsPage(
      {super.key, required this.floorId, required this.floorNumber});
  final String floorId;
  final String floorNumber;

  @override
  State<RoomsPage> createState() => _RoomsPageState();
}

class _RoomsPageState extends State<RoomsPage> {
  //late IO.Socket socket;
  http.Response response = new http.Response("body", 200);
  TextEditingController _editRoomNameController = TextEditingController();
  void initState() {
    //super.initState();
    //socket = initSocket();
    //connectSocket(socket);
    Provider.of<RoomData>(context, listen: false)
        .getRoomsByFloorId(widget.floorId);
  }

  //@override
  //void dispose() {
  //  socket.disconnect();
  //  socket.dispose();
  //  super.dispose();
  //}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitlePageStyle(text: "Salles"),
          const SizedBox(height: 15),
          TextInformationStyle(text: 'Numéro étage : ${widget.floorNumber}'),
          Expanded(
            child: Consumer<RoomData>(
              builder: (context, roomData, child) => GridView.builder(
                shrinkWrap: true,
                padding: const EdgeInsets.all(20),
                itemCount: roomData.rooms.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                ),
                itemBuilder: (context, index) {
                  final room = roomData.rooms[index];
                  return ObjectContainer(
                    icon: Icons.chair,
                    onDelete: () async => {
                      if ((await roomData.deleteRoom(
                      room)).statusCode == 200) {ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Supression de la salle'),
                        ),
                      ),
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => RoomsPage(
                          floorId: widget.floorId,
                          floorNumber: widget.floorNumber,
                        )))
                  } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                  content: Text('La supression de la salle n\'a pu aboutir.'),
                  ),
                  )
                  }},
                    onEdit: () => _editRoom(context, room, roomData),
                    onSelect: () {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) {
                          return ChangeNotifierProvider(
                            create: (BuildContext context) => DeviceData(),
                            child: MaterialApp(
                              home: DevicesPage(roomId: room.id.toString()),
                            ),
                          );
                        },
                      ));
                    },
                    title: room.name.toString(),
                    id: room.id.toString(),
                  );
                },
              ),
            ),
          )
        ],
      ),
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => AddRoomPage(
                floor_id: widget.floorId,
                floor_name: widget.floorNumber,
              ),
            ));
          },
          title: 'Ajouter une salle'),
    );
  }

  _editRoom(BuildContext context, Room room, RoomData roomData) async {
    setState(() {
      _editRoomNameController.text = room.name ?? 'No name';
    });
    _editFormDialog(context, room, roomData);
  }

  _editFormDialog(BuildContext context, Room room, RoomData roomData) {
    return showDialog(
      context: context,
      barrierDismissible: true,
      builder: (param) {
        return AlertDialog(
            actions: <Widget>[
              TextButton(
                onPressed: () async {
                  http.Response response = await roomData.updateRoom(
                      _editRoomNameController.text, room);
                  if (response.statusCode == 200) {
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => RoomsPage(
                          floorId: widget.floorId,
                          floorNumber: widget.floorNumber,
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
            title: const Text('Modifier une pièce'),
            content: SingleChildScrollView(
                child: Column(children: <Widget>[
                  TextField(
                    controller: _editRoomNameController,
                    decoration: const InputDecoration(
                        hintText: 'Nom', labelText: 'Nom de la pièce'),
                  )
                ])));
      },
    );
  }
}
