import 'dart:convert';

import 'package:app_airlux/constants.dart';
import 'package:flutter/cupertino.dart';
import 'device.dart';
import 'package:http/http.dart' as http;

class DeviceData extends ChangeNotifier {
  var str;
  var portCloud = 3010;
  var portLocal = 3030;
  var port = 3010;

  //var prefixUrl = 'http://192.168.1.96';
  var prefixUrl = 'http://10.0.2.2';

  List<Device> devices = [];

  Future<bool> checkApiOnline() async {
    var port = 3010;
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    if (await response.statusCode == 200) {
      final syncResponse = await http.post(Uri.parse('${prefixUrl}:${portLocal.toString()}/send'));
      return true;
    }
    else return false;
  }

  void getAllDevices() async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/device'), headers: header("0"));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['devices'];
      devices = results.map((e) => Device.fromJson(e)).toList();
      notifyListeners();
    } else if (response.statusCode == 404) {
      devices = <Device>[];
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getDevicesByRoomId(String id) async{
    //currentRoomId = id;
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/device'), headers: header("0"));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['devices'];
      results.removeWhere((item) => (item["room_id"]).toString()!=id);
      devices = results.map((e) => Device.fromJson(e)).toList();
      notifyListeners();
    } else if (response.statusCode == 404) {
      devices = <Device>[];
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  // Set 'on' for state on and 'off' for state off
  void getDevicesByState(String state) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/device'), headers: header("0"));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['devices'];
      if (state == "on") {
        results.removeWhere((item) => (item["value"]).substring(0, 1) != "1");
        devices = results.map((e) => Device.fromJson(e)).toList();
        notifyListeners();
      }
      else if (state == "off") {
        results.removeWhere((item) => (item["value"]).substring(0, 1) != "0");
        devices = results.map((e) => Device.fromJson(e)).toList();
        notifyListeners();
      }
      else throw Exception('Unvalid State');
    } else if (response.statusCode == 404) {
      devices = <Device>[];
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  //TODO -> OK
  // Check if the current added device is based on local room
  Future<bool> checkIfLocalRoom(String roomId) async {
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${roomId}'), headers: header("0"));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  //TODO synchro OK
  // Check if the current device action is based on local room
  Future<bool> checkIfLocalDevice(String deviceId) async {
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/device/${deviceId}'), headers: header("0"));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  //TODO synchro OK
  Future<bool> synchronizeLocalDeviceAdd(String name, String roomId,String category, String deviceIdFromCloud) async {
    if (await checkIfLocalRoom(roomId) == true){
      final response = await http.post(
        Uri.parse('${prefixUrl}:${portLocal.toString()}/device'), headers: header("0"),
        body: jsonEncode({
          'room_id': roomId,
          'device_id': deviceIdFromCloud,
          'category': category,
          'name': name
        }),
      );
      if (await response.statusCode != 201) throw Exception('Failed to load data');
    }
    return true;
  }

  //TODO synchro OK
  Future<http.Response> addDevice(String name,String category, String roomId) async {
    String sync ="0";
    if (await checkApiOnline() == false) {
      port = portLocal;
      sync = "1";
    }
    else port = portCloud;

    final response = await http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/device'), headers: header(sync),
      body: jsonEncode({
        'name': name,
        'category': category,
        'room_id': roomId
      }),
    );
    if (await response.statusCode == 201) {
      str = json.decode(response.body);
      final String deviceCreatedId = str['data']['id'];
      //Synchro with local (if added in cloud)
      if (port != portLocal) {
        await synchronizeLocalDeviceAdd(name, roomId,category, deviceCreatedId);
      }
      //TODO ajouter else si on est en local alors appeller synchro log api
    }
    return response;
  }

  //TODO synchro OK
  Future<http.Response> updateDevice(String deviceName, Device device) async {
    String sync ="0";
    if (await checkApiOnline() == false) {
      port = portLocal;
      sync = "1";
    }
    else {
      port = portCloud;
      if (await checkIfLocalDevice(device.id!) == true){
        final response = await http.put(
          Uri.parse('${prefixUrl}:${portLocal.toString()}/device/${device.id.toString()}'), headers: header(sync),
          body: jsonEncode(<String, String>{
            'name': deviceName,
          })
        );
        if (await response.statusCode != 201) throw Exception('Failed to load data');
      }
    }
    return await http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/device/${device.id.toString()}'), headers: header(sync),
      body: jsonEncode(<String, String>{
        'name': deviceName,
      }),
    );
  }

  //TODO synchro TESTER BORDEL
  Future<http.Response> updateDeviceValue(String value, Device device) async {
    String sync ="0";
    if (await checkApiOnline() == false) {
      port = portLocal;
      sync = "1";
    }
    else {
      port = portCloud;
      if (await checkIfLocalDevice(device.id!) == true){
        final response = await http.put(
            Uri.parse('${prefixUrl}:${portLocal.toString()}/device/${device.id.toString()}'), headers: header(sync),
            body: jsonEncode(<String, String>{
              'value': value,
            })
        );
        if (await response.statusCode != 201) throw Exception('Failed to load data');
      }
    }
    return await http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/device/${device.id.toString()}'), headers: header(sync),
      body: jsonEncode(<String, String>{
        'value': value,
      }),
    );
  }

  //TODO synchro OK
  Future<http.Response> deleteDevice(Device device) async {
    String sync ="0";
    if (await checkApiOnline() == false) {
      port = portLocal;
      sync = "1";
    }
    else {
      port = portCloud;
      final response = await http.delete(Uri.parse('${prefixUrl}:${portLocal.toString()}/device/${device.id.toString()}'), headers: header(sync));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
    }

    return http.delete(Uri.parse('${prefixUrl}:${port.toString()}/device/' + device.id.toString()), headers: header(sync));
  }
}
