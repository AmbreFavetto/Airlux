import 'dart:convert';

import 'package:app_airlux/models/buildings/rooms/room.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;


class RoomData extends ChangeNotifier {
  var str;
  //var prefixUrl = 'http://192.168.1.29';
  var prefixUrl = 'http://10.0.2.2'; // en attendant de réussir à récupérer automatique l'ip de la machine
  var port = 3010;
  List<Room> rooms = [Room(name: 'firstRoom', id: '1', floor_id: '1'), Room(name: 'secondRoom', id: '2', floor_id: '2')];
  Room room = Room(name: 'room', id: '1', floor_id: '1');

  void getAllRooms() async {
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

  Future<http.Response> addRoom(String name, String floorId) {
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
  }

  Future<http.Response> updateRoom(String roomName, Room room) {
    return http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/room/${room.id.toString()}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': roomName,
      }),
    );
  }

  void deleteRoom2(Room room) async {
    final response = await http.delete(Uri.parse('${prefixUrl}:${port.toString()}/room/${room.id.toString()}'));
    if (response.statusCode != 200) {
      throw Exception('Failed to load data');
    }
  }
  Future<http.Response> deleteRoom(Room room) {
    return http.delete(Uri.parse('${prefixUrl}:${port.toString()}/room/${room.id.toString()}'));
  }
}