import 'dart:convert';

import 'package:app_airlux/constants.dart';
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
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/building'), headers: header("0"));
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

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/building', id), headers: header("0"));
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
    String sync ="0";
    if (await checkApiOnline() == false) {
      port = portLocal;
      sync = "1";
    }
    else port = portCloud;

    return http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/building'), headers: header(sync),
      body: jsonEncode({
        'name': name,
      }),
    );
  }

  Future<http.Response> updateBuilding(String buildingName, Building building) async {
    String sync ="0";
    if (await checkApiOnline() == false) {
      port = portLocal;
      sync = "1";
    }
    else port = portCloud;

    return http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/building/${building.id.toString()}'), headers: header(sync),
      body: jsonEncode(<String, String>{
        'name': buildingName,
      }),
    );
  }

  void deleteBuilding(Building building) async {
    String sync ="0";
    if (await checkApiOnline() == false) {
      port = portLocal;
      sync = "1";
    }
    else port = portCloud;

    final response = await http.delete(Uri.parse('${prefixUrl}:${port.toString()}/building/${building.id.toString()}'), headers: headerLessToken(sync));
    if (response.statusCode == 200) {
      getAllBuildings();
    } else {
      throw Exception('Failed to load data');
    }
  }
}