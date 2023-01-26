import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'device.dart';
import 'package:http/http.dart' as http;

import 'package:app_airlux/models/devices/room.dart';

class RoomData extends ChangeNotifier {
  var str;

  List<Room> rooms = [Room(building_id: 0, floor_id: 0, name: "", id: 0)];

  void getRoomsFromFloor(int? idFloor, int? idBuilding) async{
    final response = await http.get(Uri.parse('http://10.0.2.2:3000/room/'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['rooms'];
      results.removeWhere((item) => item["building_id"]!=idBuilding);
      results.removeWhere((item) => item["floor_id"]!=idFloor);
      rooms = results.map((e) => Room.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }
}
