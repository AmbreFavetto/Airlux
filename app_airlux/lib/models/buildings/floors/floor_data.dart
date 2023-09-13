import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'floor.dart';
import 'package:http/http.dart' as http;

class FloorData extends ChangeNotifier {
  var str;
  //var prefixUrl = 'http://192.168.1.29';
  var prefixUrl = 'http://10.0.2.2'; // en attendant de réussir à récupérer automatique l'ip de la machine
  var port = 3010;
  List<Floor> floors = [Floor(number: '0', id: '1', building_id: '1'), Floor(number: '0', id: '2', building_id: '2')];
  Floor floor = Floor(number: '0', id: '1', building_id: '1');

  void getAllFloors() async {
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/floor'));
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
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/floor'));
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
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/floor', id));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final dynamic result = str['data']['floors'];
      floor = result.map((e) => Floor.fromJson(e));
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  Future<http.Response> addFloor(String name, String buildingId) {
    return http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/floor'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'name': name,
        'building_id': buildingId
      }),
    );
  }

  Future<http.Response> updateFloor(String floorName, Floor floor) {
    return http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/floor/${floor.id.toString()}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': floorName,
      }),
    );
  }

  Future<http.Response> deleteFloor(Floor floor) {
    return http.delete(Uri.parse('${prefixUrl}:${port.toString()}/floor/${floor.id.toString()}'));
  }
  void deleteFloor2(Floor floor) async {
    final response = await http.delete(Uri.parse('${prefixUrl}:${port.toString()}/floor/${floor.id.toString()}'));
    if (response.statusCode != 200) {
      throw Exception('Failed to load data');
    }
  }
}