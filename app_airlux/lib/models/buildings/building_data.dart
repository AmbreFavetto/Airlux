import 'dart:convert';

import 'package:app_airlux/constants.dart';
import 'package:app_airlux/models/buildings/userBuilding.dart';
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
  List<UserBuilding> userBuildings = [UserBuilding(building_id: '', user_id: '', id: ''), UserBuilding(building_id: '', user_id: '', id: '')];
  List<String> building_IDs = [];

  Future<bool> checkApiOnline() async {
    var port = 3010;
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    if (await response.statusCode == 200) {
      //final syncResponse = await http.post(Uri.parse('${prefixUrl}:${portLocal.toString()}/send'));
      return true;
    }
    else return false;
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

  void getBuildingsByUser() async{
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final responseUserBuildings = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/user-building'), headers: header("0"));
    if (responseUserBuildings.statusCode == 200) {
      str = json.decode(responseUserBuildings.body);
      final List<dynamic> results = str['data']['usersBuildings'];
      results.removeWhere((item) => item["user_id"]!=userId);
      userBuildings = results.map((e) => UserBuilding.fromJson(e)).toList();
      print(userBuildings);
      userBuildings.forEach((element) { //Recover building IDs, related to the userID
        building_IDs.add(element.building_id);
      });
      final responseBuildings = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/building'), headers: header("0"));
      if (responseBuildings.statusCode == 200) {
        str = json.decode(responseBuildings.body);
        final List<dynamic> resultsBuildings = str['data']['buildings'];
        resultsBuildings.removeWhere((element) => !building_IDs.contains(element['building_id']));
        buildings = resultsBuildings.map((e) => Building.fromJson(e)).toList();

      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
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

  Future<bool> synchronizeLocalBuildingAdd(String name, String buildingIdFromCloud) async {
    String sync = "0";
    final response = await http.post(
      Uri.parse('${prefixUrl}:${portLocal.toString()}/building'), headers: header(sync),
      body: jsonEncode({
        'building_id': buildingIdFromCloud,
        'name': name
      }),
    );
    if (await response.statusCode != 201) throw Exception('Failed to load data');
    return true;
  }

  Future<bool> synchronizeLocalUserBuildingAdd(String buildingIdFromCloud, String userBuildingCreatedId) async {
    String sync = "0";
    final response = await http.post(
      Uri.parse('${prefixUrl}:${portLocal.toString()}/user-building'), headers: header(sync),
      body: jsonEncode({
        'building_id': buildingIdFromCloud,
        'user_id': userId,
        'userBuilding_id': userBuildingCreatedId
      }),
    );
    if (await response.statusCode != 201) throw Exception('Failed to load data');
    return true;
  }

  Future<http.Response> addBuilding(String name) async {
    String sync ="0";
    if (await checkApiOnline() == false) {
      port = portLocal;
      sync = "1";
    }
    else port = portCloud;

    //Add building and synchronize
    final http.Response responseBuilding = await http.post(
        Uri.parse('${prefixUrl}:${port.toString()}/building'), headers: header(sync),
        body: jsonEncode({
          'name': name,
        }),
    );
    if (await responseBuilding.statusCode == 201) {
      str = json.decode(responseBuilding.body);
      final String buildingCreatedId = str['data']['id'];
      if (port != portLocal) {
        await synchronizeLocalBuildingAdd(name, buildingCreatedId);
      }

      //Related building and user
      final responseUserBuilding = await http.post(
        Uri.parse('${prefixUrl}:${port.toString()}/user-building'), headers: header(sync),
        body: jsonEncode({
          'building_id': buildingCreatedId,
          'user_id': userId
        }),
      );
      if (await responseUserBuilding.statusCode == 201) {
        str = json.decode(responseUserBuilding.body);
        final String userBuildingCreatedId = str['data']['id'];
        if (port != portLocal) {
          await synchronizeLocalUserBuildingAdd(buildingCreatedId, userBuildingCreatedId);
        }
      }
    }
    return responseBuilding;
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