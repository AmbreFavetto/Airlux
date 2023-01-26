import 'dart:convert';

import 'package:app_airlux/models/buildings/rooms/room.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;


class RoomData extends ChangeNotifier {
  var str;

  List<Room> rooms = [Room(name: 'firstRoom', id: 1, floor_id: 1), Room(name: 'secondRoom', id: 2, floor_id: 2)];
  Room room = Room(name: 'room', id: 1);

  void getAllRooms() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3000/room'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['rooms'];
      rooms = results.map((e) => Room.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getRoomsByRoomId(int? id) async{
    final response = await http.get(Uri.parse('http://10.0.2.2:3000/room'));
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
    final response = await http.get(Uri.parse('http://10.0.2.2:3000/room', id));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final dynamic result = str['data']['rooms'];
      room = result.map((e) => Room.fromJson(e));
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void deleteRoom(Room room) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:3000/room/' + room.id.toString()));
    if (response.statusCode == 200) {
      getAllRooms();
    } else {
      throw Exception('Failed to load data');
    }
  }
}