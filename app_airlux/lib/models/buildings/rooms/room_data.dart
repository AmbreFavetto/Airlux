import 'dart:convert';

import 'package:app_airlux/constants.dart';
import 'package:app_airlux/models/buildings/rooms/room.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;


class RoomData extends ChangeNotifier {
  var str;
  var portCloud = 3010;
  var portLocal = 3030;
  var port = 3010;
  //var prefixUrl = 'http://192.168.1.96';
  var prefixUrl = 'http://10.0.2.2';

  List<Room> rooms = [];
  Room room = Room(name: 'room', id: '1', floor_id: '1');

  Future<bool> checkApiLocalAvailable() async {
    try {
      final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/health'), headers: header("0"));
      if (await response.statusCode == 200)
        apiIsOnline = true;
      else apiIsOnline = false;
    }
    catch(e){
      apiIsOnline = false;
    }
    return apiIsOnline;
  }

  Future<bool> checkApiOnline() async {
    checkApiLocalAvailable();
    var port = 3010;
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    if (await response.statusCode == 200) {
      //final syncResponse = await http.post(Uri.parse('${prefixUrl}:${portLocal.toString()}/send'));
      return true;
    }
    else return false;
  }

 /* void getAllRooms() async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/room'), headers: header("0"));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['rooms'];
      rooms = results.map((e) => Room.fromJson(e)).toList();
      notifyListeners();
    } else if (response.statusCode == 404) {
      rooms = <Room>[];
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }*/

  void getRoomsByFloorId(String id) async{
    checkApiLocalAvailable();
    //currentFloorId = id;
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/room'), headers: header("0"));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['rooms'];
      results.removeWhere((item) => item["floor_id"]!=id);
      rooms = results.map((e) => Room.fromJson(e)).toList();
      notifyListeners();
    } else if (response.statusCode == 404) {
      rooms = <Room>[];
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

/*  void getRoomById(int id) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/room', id), headers: header("0"));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final dynamic result = str['data']['rooms'];
      room = result.map((e) => Room.fromJson(e));
      notifyListeners();
    } else if (response.statusCode == 404) {
      rooms = <Room>[];
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }*/

  // Check if the current added room is based on local building
  Future<bool> checkIfLocalFloor(String floorId) async {
    checkApiLocalAvailable();
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floorId}'), headers: header("0"));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  // Check if the current room action is based on local floor
  Future<bool> checkIfLocalRoom(String roomId) async {
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${roomId}'), headers: header("0"));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

/*  Future<bool> synchronizeLocalRoomAdd(String name, String floorId, String roomIdFromCloud) async {
    if (await checkIfLocalFloor(floorId) == true){
      final response = await http.post(
        Uri.parse('${prefixUrl}:${portLocal.toString()}/room'), headers: header("0"),
        body: jsonEncode({
          'floor_id': floorId,
          'room_id': roomIdFromCloud,
          'name': name
        }),
      );
      if (await response.statusCode != 201) throw Exception('Failed to load data');
    }
    return true;
  }*/
  
  Future<http.Response> addRoom(String name, String floorId) async {
    checkApiLocalAvailable();
    String sync ="1";
    final response = await http.post(
      Uri.parse('${prefixUrl}:${portLocal.toString()}/room'), headers: header(sync),
      body: jsonEncode({
        'name': name,
        'floor_id': floorId
      }),
    );
    return await response;
  }

  Future<http.Response> updateRoom(String roomName, Room room) async {
    String sync ="1";
    if (await checkApiOnline() == true) {
      final response = await http.put(
        Uri.parse('${prefixUrl}:${portCloud.toString()}/room/${room.id.toString()}'), headers: header(sync),
        body: jsonEncode(<String, String>{
          'name': roomName,
        }),
      );
      return await response;
    }
    else {
      final response = await http.put(
        Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${room.id.toString()}'), headers: header(sync),
        body: jsonEncode(<String, String>{
          'name': roomName,
        }),
      );
      if (await response.statusCode != 201) throw Exception('Failed to load data');
      return await response;
      }
  }

 /* Future<http.Response> updateRoom(String roomName, Room room) async {
    checkApiLocalAvailable();
    String sync ="1";
    if (await checkApiOnline() == false) {
      port = portLocal;
    }
    else {
      port = portCloud;
      if (await checkIfLocalRoom(room.id!) == true){
        final response = await http.put(
          Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${room.id.toString()}'), headers: header(sync),
          body: jsonEncode(<String, String>{
            'name': roomName,
          }),
        );
        if (await response.statusCode != 201) throw Exception('Failed to load data');
      }
    }
    return await http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/room/${room.id.toString()}'), headers: header(sync),
      body: jsonEncode(<String, String>{
        'name': roomName,
      }),
    );
  }*/

  Future<http.Response> deleteRoom(Room room) async{
    String sync ="1";
    if (await checkApiOnline() == true) {
      final response = await http.delete(Uri.parse('${prefixUrl}:${portCloud.toString()}/room/${room.id.toString()}'), headers: header(sync));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
      return await response;
    }
    else {
      final response = await http.delete(Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${room.id.toString()}'), headers: header(sync));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
      return await response;
    }
    return http.delete(Uri.parse('${prefixUrl}:${port.toString()}/room/' + room.id.toString()), headers: header(sync));
  }

/*  Future<http.Response> deleteRoom(Room room) async{
    checkApiLocalAvailable();
    String sync ="1";
    if (await checkApiOnline() == false) {
      port = portLocal;
    }
    else {
      port = portCloud;
      final response = await http.delete(Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${room.id.toString()}'), headers: header(sync));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
    }
    return http.delete(Uri.parse('${prefixUrl}:${port.toString()}/room/' + room.id.toString()), headers: header(sync));
  }*/

}