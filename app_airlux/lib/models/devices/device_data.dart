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

  List<Device> devices = [];

  Future<bool> checkApiOnline() async {
    var port = 3010;
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    if (await response.statusCode == 200) {
      //final syncResponse = await http.post(Uri.parse('${prefixUrl}:${portLocal.toString()}/send'));
      return true;
    }
    else return false;
  }

/*  void getAllDevices() async {
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
  }*/

  void getDevicesByRoomId(String id) async{
    checkApiLocalAvailable();
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
    checkApiLocalAvailable();
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

  // Check if the current added device is based on local room
  Future<bool> checkIfLocalRoom(String roomId) async {
    checkApiLocalAvailable();
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/room/${roomId}'), headers: header("0"));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  // Check if the current device action is based on local room
  Future<bool> checkIfLocalDevice(String deviceId) async {
    checkApiLocalAvailable();
    final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/device/${deviceId}'), headers: header("0"));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

 /* Future<bool> synchronizeLocalDeviceAdd(String name, String roomId,String category, String deviceIdFromCloud) async {
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
  }*/

  Future<http.Response> addDevice(String name,String category, String roomId) async {
    checkApiLocalAvailable();
    String sync ="1";
    final response = await http.post(
      Uri.parse('${prefixUrl}:${portLocal.toString()}/device'), headers: header(sync),
      body: jsonEncode({
        'name': name,
        'category': category,
        'room_id': roomId
      }),
    );
    return response;
  }

  Future<http.Response> updateDevice(String deviceName, Device device) async {
    String sync ="1";
    if (await checkApiOnline() == true) {
      final response = await http.put(
          Uri.parse('${prefixUrl}:${portCloud.toString()}/device/${device.id.toString()}'), headers: header(sync),
          body: jsonEncode(<String, String>{
            'name': deviceName,
          })
      );
      return await response;
    }
    else {
      final response = await http.put(
          Uri.parse('${prefixUrl}:${portLocal.toString()}/device/${device.id.toString()}'), headers: header(sync),
          body: jsonEncode(<String, String>{
            'name': deviceName,
          })
      );
      if (await response.statusCode != 201) throw Exception('Failed to load data');
      return await response;
    }
  }

/*  Future<http.Response> updateDevice(String deviceName, Device device) async {
    checkApiLocalAvailable();
    String sync ="1";
    if (await checkApiOnline() == false) {
      port = portLocal;
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
  }*/

  //TODO synchro TESTER BORDEL
  Future<http.Response> updateDeviceValue(String value, Device device) async {
    String sync ="1";
    if (await checkApiOnline() == true) {
      final response = await http.put(
          Uri.parse('${prefixUrl}:${portCloud.toString()}/device/${device.id.toString()}'), headers: header(sync),
          body: jsonEncode(<String, String>{
            'value': value,
          })
      );
      return await response;
    }
    else {
      final response = await http.put(
          Uri.parse('${prefixUrl}:${portLocal.toString()}/device/${device.id.toString()}'), headers: header(sync),
          body: jsonEncode(<String, String>{
            'value': value,
          })
      );
      if (await response.statusCode != 201) throw Exception('Failed to load data');
      return await response;
    }
  }

  Future<http.Response> deleteDevice(Device device) async {
    String sync ="1";
    if (await checkApiOnline() == true) {
      final response = await http.delete(Uri.parse('${prefixUrl}:${portCloud.toString()}/device/${device.id.toString()}'), headers: header(sync));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
      return await response;
    }
    else {
      final response = await http.delete(Uri.parse('${prefixUrl}:${portLocal.toString()}/device/${device.id.toString()}'), headers: header(sync));
      if (response.statusCode != 200) {
        throw Exception('Failed to load data');
      }
      return await response;
    }
  }
}
