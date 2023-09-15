import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'building.dart';
import 'package:http/http.dart' as http;

class BuildingData extends ChangeNotifier {
  var str;
  //var prefixUrl = 'http://192.168.1.29';
  var prefixUrl = 'http://10.0.2.2'; // en attendant de réussir à récupérer automatique l'ip de la machine
  var portCloud = 3010;
  var portLocal = 3030;
  var port = 3010;
  List<Building> buildings = [Building(name: ' ', id: '1'), Building(name: ' ', id: '2')];
  Building building = Building(name: 'building', id: '1');

  Future<bool> checkApiOnline() async {
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    return await response.statusCode == 200 ? true : false ;
  }

  void getAllBuildings() async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;
    print('${prefixUrl} : ${port.toString()} /building');
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/building'));
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
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/building', id));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final dynamic result = str['data']['buildings'];
      building = result.map((e) => Building.fromJson(e));
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  Future<http.Response> addBuilding(String name) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    return http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/building'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'name': name,
      }),
    );
  }

  Future<http.Response> updateBuilding(String buildingName, Building building) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    return http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/building/${building.id.toString()}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': buildingName,
      }),
    );
  }

  void deleteBuilding(Building building) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.delete(Uri.parse('${prefixUrl}:${port.toString()}/building/${building.id.toString()}'));
    if (response.statusCode == 200) {
      getAllBuildings();
    } else {
      throw Exception('Failed to load data');
    }
  }
}