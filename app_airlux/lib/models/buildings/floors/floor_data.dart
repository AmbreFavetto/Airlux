import 'dart:convert';

import 'package:app_airlux/models/buildings/building.dart';
import 'package:flutter/cupertino.dart';
import 'floor.dart';
import 'package:http/http.dart' as http;

class FloorData extends ChangeNotifier {
  var str;
  //var prefixUrl = 'http://192.168.1.29';
  var prefixUrl = 'http://10.0.2.2'; // en attendant de réussir à récupérer automatique l'ip de la machine
  var portCloud = 3010;
  var portLocal = 3030;
  var port = 3010;
  List<Floor> floors = [Floor(name: ' ', id: '1', building_id: '1'), Floor(name: ' ', id: '2', building_id: '2')];
  Floor floor = Floor(name: '0', id: '1', building_id: '1');
  Building building = Building(name: '', id: '1');

  Future<bool> checkApiOnline() async {
    final response = await http.get(Uri.parse('${prefixUrl}:${portCloud.toString()}/health'));
    return await response.statusCode == 200 ? true : false ;
  }

  void getAllFloors() async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

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
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;
print ('${prefixUrl}:${port.toString()}/floor');
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/floor'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['floors'];
      results.removeWhere((item) => item["building_id"]!=id);
      print (results);
      floors = results.map((e) => Floor.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getFloorById(int id) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

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
 // Check if the current added floor is based on local building
  Future<bool> checkIfLocalBuilding(String buildingId) async {
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/building/${buildingId}'));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
  // Check if the current floor action is based on local floor
  Future<bool> checkIfLocalFloor(String floorId) async {
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floorId}'));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  Future<bool> synchronizeLocalFloorAdd(String name, String buildingId, String floorIdFromCloud) async {
    if (await checkIfLocalBuilding(buildingId) == true){
    final response = await http.post(
      Uri.parse('${prefixUrl}:${portLocal.toString()}/floor'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'building_id': buildingId,
        'floor_id': floorIdFromCloud,
        'name': name
      }),
    );
    if (await response.statusCode != 201) throw Exception('Failed to load data');
    }
    return true;
  }

  //TODO synchro OK
  Future<http.Response> addFloor(String name, String buildingId) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/floor'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'name': name,
        'building_id': buildingId
      }),
    );
    if (await response.statusCode == 201) {
      str = json.decode(response.body);
      final String floorCreatedId = str['data']['id'];
      if (port != portLocal) {
        await synchronizeLocalFloorAdd(name, buildingId, floorCreatedId);
      }
      //TODO ajouter else si on est en local alors appeller synchro log api
    }
    return response;
  }

  //TODO synchro OK
  Future<http.Response> updateFloor(String floorName, Floor floor) async {
    if (await checkApiOnline() == false) port = portLocal;
    else {
      port = portCloud;
      if (await checkIfLocalFloor(floor.id!) == true){
        final response = await http.put(
          Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floor.id.toString()}'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: jsonEncode(<String, String>{
            'name': floorName,
          }),
        );
        if (await response.statusCode != 201) throw Exception('Failed to load data');
      }
    }
    return await http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/floor/${floor.id.toString()}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': floorName,
      }),
    );
  }

  //TODO synchro OK
  Future<http.Response> deleteFloor(Floor floor) async{
    if (await checkApiOnline() == false) port = portLocal;
    else {
      port = portCloud;
      final response = await http.delete(Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floor.id.toString()}'));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
    }
    return http.delete(Uri.parse('${prefixUrl}:${port.toString()}/floor/' + floor.id.toString()));
  }

}