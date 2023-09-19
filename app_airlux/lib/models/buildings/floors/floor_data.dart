import 'dart:convert';

import 'package:app_airlux/constants.dart';
import 'package:app_airlux/models/buildings/building.dart';
import 'package:flutter/cupertino.dart';
import 'floor.dart';
import 'package:http/http.dart' as http;

class FloorData extends ChangeNotifier {
  var str;
  var portCloud = 3010;
  var portLocal = 3030;
  var port = 3010;
  //var prefixUrl = 'http://192.168.1.96';
  var prefixUrl = 'http://10.0.2.2';

  Future<bool> checkApiLocalAvailable() async {
    try {
      final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/health'), headers: header("0"));
      if (await response.statusCode == 200)
        apiIsOnline = true;
      else apiIsOnline = false;
    }
    catch(e){
      apiIsOnline = false;
    }
    return apiIsOnline;
  }

  List<Floor> floors = [];
  Floor floor = Floor(name: '', id: '1', building_id: '1');
  Building building = Building(name: '', id: '1');

  Future<bool> checkApiOnline() async {
    checkApiLocalAvailable();
    var port = 3010;
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    if (await response.statusCode == 200) {
      //final syncResponse = await http.post(Uri.parse('${prefixUrl}:${portLocal.toString()}/send'));
      return true;
    }
    else return false;
  }

 /* void getAllFloors() async {
    String sync = "0";
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/floor'), headers: header(sync));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['floors'];
      floors = results.map((e) => Floor.fromJson(e)).toList();
      notifyListeners();
    } else if (response.statusCode == 404) {
      floors = <Floor>[];
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }*/

  void getFloorsByBuildingId(String id) async{
    //currentBuildingId = id;
    String sync = "0";
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;
    print ('${prefixUrl}:${port.toString()}/floor');
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/floor'), headers: header(sync));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['floors'];
      results.removeWhere((item) => item["building_id"]!=id);
      print (results);
      floors = results.map((e) => Floor.fromJson(e)).toList();
      notifyListeners();
    } else if (response.statusCode == 404) {
      floors = <Floor>[];
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

/*  void getFloorById(int id) async {
    String sync = "0";
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/floor', id), headers: header(sync));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final dynamic result = str['data']['floors'];
      floor = result.map((e) => Floor.fromJson(e));
      notifyListeners();
    } else if (response.statusCode == 404) {
      floors = <Floor>[];
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }*/

 // Check if the current added floor is based on local building
  Future<bool> checkIfLocalBuilding(String buildingId) async {
    checkApiLocalAvailable();
    String sync = "0";
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/building/${buildingId}'), headers: header(sync));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
  // Check if the current floor action is based on local floor
  Future<bool> checkIfLocalFloor(String floorId) async {
    checkApiLocalAvailable();
    String sync = "0";
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floorId}'), headers: header(sync));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

/*  Future<bool> synchronizeLocalFloorAdd(String name, String buildingId, String floorIdFromCloud) async {
    String sync = "0";
    if (await checkIfLocalBuilding(buildingId) == true){
    final response = await http.post(
      Uri.parse('${prefixUrl}:${portLocal.toString()}/floor'), headers: header(sync),
      body: jsonEncode({
        'building_id': buildingId,
        'floor_id': floorIdFromCloud,
        'name': name
      }),
    );
    if (await response.statusCode != 201) throw Exception('Failed to load data');
    }
    return true;
  }*/

  //TODO synchro OK
  Future<http.Response> addFloor(String name, String buildingId) async {
    checkApiLocalAvailable();
    String sync ="1";
    final response = await http.post(
      Uri.parse('${prefixUrl}:${portLocal.toString()}/floor'), headers: header(sync),
      body: jsonEncode({
        'name': name,
        'building_id': buildingId
      }),
    );
    return response;
  }

  Future<http.Response> updateFloor(String floorName, Floor floor) async {
    String sync ="1";
    if (await checkApiOnline() == true) {
      return await http.put(
        Uri.parse('${prefixUrl}:${portCloud.toString()}/floor/${floor.id.toString()}'), headers: header(sync),
        body: jsonEncode(<String, String>{
          'name': floorName,
        }),
      );
    }
    else {
      return await http.put(
        Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floor.id.toString()}'), headers: header(sync),
        body: jsonEncode(<String, String>{
          'name': floorName,
        }),
      );
    }
  }

  /*Future<http.Response> updateFloor(String floorName, Floor floor) async {
    checkApiLocalAvailable();

    String sync ="1";
    if (await checkApiOnline() == false) {
      port = portLocal;
    }
    else {
      port = portCloud;
      if (await checkIfLocalFloor(floor.id!) == true){
        final response = await http.put(
          Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floor.id.toString()}'), headers: header(sync),
          body: jsonEncode(<String, String>{
            'name': floorName,
          }),
        );
        if (await response.statusCode != 201) throw Exception('Failed to load data');
      }
    }
    return await http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/floor/${floor.id.toString()}'), headers: header(sync),
      body: jsonEncode(<String, String>{
        'name': floorName,
      }),
    );
  }*/

/*  Future<http.Response> deleteFloor(Floor floor) async{
    checkApiLocalAvailable();
    String sync ="1";
    if (await checkApiOnline() == false) {
      port = portLocal;
    }
    else {
      port = portCloud;
      final response = await http.delete(Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floor.id.toString()}'), headers: header(sync));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
    }
    return http.delete(Uri.parse('${prefixUrl}:${port.toString()}/floor/' + floor.id.toString()), headers: header(sync));
  }*/
  Future<http.Response> deleteFloor(Floor floor) async{
    String sync ="1";
    if (await checkApiOnline() == true) {
      final response = await http.delete(Uri.parse('${prefixUrl}:${portCloud.toString()}/floor/${floor.id.toString()}'), headers: header(sync));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
      return await response;
    }
    else {
      final response = await http.delete(Uri.parse('${prefixUrl}:${portLocal.toString()}/floor/${floor.id.toString()}'), headers: header(sync));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
      return await response;
    }

  }

}