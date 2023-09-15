import 'dart:convert';

import 'package:app_airlux/models/buildings/rooms/room.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;


class RoomData extends ChangeNotifier {
  var str;
  //var prefixUrl = 'http://192.168.1.29';
  var prefixUrl = 'http://10.0.2.2'; // en attendant de réussir à récupérer automatique l'ip de la machine
  var portCloud = 3010;
  var portLocal = 3030;
  var port = 3010;
  List<Room> rooms = [Room(name: 'firstRoom', id: '1', floor_id: '1'), Room(name: 'secondRoom', id: '2', floor_id: '2')];
  Room room = Room(name: 'room', id: '1', floor_id: '1');

  Future<bool> checkApiOnline() async {
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    return await response.statusCode == 200 ? true : false ;
  }

  void getAllRooms() async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/room'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['rooms'];
      rooms = results.map((e) => Room.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getRoomsByFloorId(String id) async{
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/room'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['rooms'];
      results.removeWhere((item) => item["floor_id"]!=id);
      rooms = results.map((e) => Room.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getRoomById(int id) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/room', id));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final dynamic result = str['data']['rooms'];
      room = result.map((e) => Room.fromJson(e));
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  //TODO -> to check (renamed)
  // Check if the current added room is based on local building
  Future<bool> checkIfLocalFloor(String floorId) async {
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floorId}'));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  //TODO -> to check (renamed)
  // Check if the current room action is based on local floor
  Future<bool> checkIfLocalRoom(String roomId) async {
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${roomId}'));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  //TODO -> to check (renamed)
  Future<bool> synchronizeLocalRoomAdd(String name, String floorId, String roomIdFromCloud) async {
    if (await checkIfLocalFloor(floorId) == true){
      final response = await http.post(
        Uri.parse('${prefixUrl}:${portLocal.toString()}/room'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({
          'floor_id': floorId,
          'room_id': roomIdFromCloud,
          'name': name
        }),
      );
      if (await response.statusCode != 201) throw Exception('Failed to load data');
    }
    return true;
  }

  //TODO synchro OK -> attendre correction local ambre et confirmer
  Future<http.Response> addRoom(String name, String floorId) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/room'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'name': name,
        'floor_id': floorId
      }),
    );
    if (await response.statusCode == 201) {
      str = json.decode(response.body);
      final String roomCreatedId = str['data']['id'];
      //Synchro with local (if added in cloud)
      if (port != portLocal) {
        await synchronizeLocalRoomAdd(name, floorId, roomCreatedId);
      }
      //TODO ajouter else si on est en local alors appeller synchro log api
    }
    return response;
  }

/*  Future<http.Response> addRoom(String name, String floorId) async{
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    return http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/room'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'name': name,
        'floor_id': floorId
      }),
    );
  }*/

  //TODO synchro OK -> attendre correction local ambre et confirmer
  Future<http.Response> updateRoom(String roomName, Room room) async {
    if (await checkApiOnline() == false) port = portLocal;
    else {
      port = portCloud;
      if (await checkIfLocalRoom(room.id!) == true){
        final response = await http.put(
          Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${room.id.toString()}'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: jsonEncode(<String, String>{
            'name': roomName,
          }),
        );
        if (await response.statusCode != 201) throw Exception('Failed to load data');
      }
    }
    return await http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/room/${room.id.toString()}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': roomName,
      }),
    );
  }

 /* Future<http.Response> updateRoom(String roomName, Room room) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    return http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/room/${room.id.toString()}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': roomName,
      }),
    );
  }*/

  //TODO -> to implement synchro
  Future<http.Response> deleteRoom(Room room) async{
    if (await checkApiOnline() == false) port = portLocal;
    else {
      port = portCloud;
      final response = await http.delete(Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${room.id.toString()}'));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
    }

    return http.delete(Uri.parse('${prefixUrl}:${port.toString()}/room/' + room.id.toString()));
  }
}