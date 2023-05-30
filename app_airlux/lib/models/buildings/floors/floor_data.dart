import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'floor.dart';
import 'package:http/http.dart' as http;

class FloorData extends ChangeNotifier {
  var str;

  List<Floor> floors = [Floor(number: '0', id: '1', building_id: '1'), Floor(number: '0', id: '2', building_id: '2')];
  Floor floor = Floor(number: '0', id: '1', building_id: '1');

  void getAllFloors() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3010/floor'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['floors'];
      floors = results.map((e) => Floor.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getFloorsByBuildingId(String id) async{
    final response = await http.get(Uri.parse('http://10.0.2.2:3010/floor'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['floors'];
      results.removeWhere((item) => item["building_id"]!=id);
      floors = results.map((e) => Floor.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getFloorById(int id) async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3010/floor', id));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final dynamic result = str['data']['floors'];
      floor = result.map((e) => Floor.fromJson(e));
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void deleteFloor(Floor floor) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:3010/floor/' + floor.id.toString()));
    if (response.statusCode == 200) {
      getAllFloors();
    } else {
      throw Exception('Failed to load data');
    }
  }
}