import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'building.dart';
import 'package:http/http.dart' as http;

class BuildingData extends ChangeNotifier {
  var str;

  List<Building> buildings = [Building(name: 'firstBuilding', id: '1'), Building(name: 'secondBuilding', id: '2')];
  Building building = Building(name: 'building', id: '1');

  void getAllBuildings() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3010/building'));
    final response = await http.get(Uri.parse('http://10.0.2.2:3010/building'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['buildings'];
      buildings = results.map((e) => Building.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getBuilding(int id) async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3010/building', id));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final dynamic result = str['data']['buildings'];
      building = result.map((e) => Building.fromJson(e));
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  Future<http.Response> addBuilding(String name) {
    return http.post(
      Uri.parse('http://10.0.2.2:3010/building'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'name': name,
      }),
    );
  }

  Future<http.Response> updateBuilding(String buildingName, Building building) {
    return http.put(
      Uri.parse('http://10.0.2.2:3010/building/' + building.id.toString()),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': buildingName,
      }),
    );
  }

  void deleteBuilding(Building building) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:3010/building/' + building.id.toString()));
    final response = await http.delete(Uri.parse('http://10.0.2.2:3010/building/' + building.id.toString()));
    if (response.statusCode == 200) {
      getAllBuildings();
    } else {
      throw Exception('Failed to load data');
    }
  }
}