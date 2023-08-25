import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'device.dart';
import 'package:http/http.dart' as http;

class DeviceData extends ChangeNotifier {
  var str;

  List<Device> devices = [];

  void getAllDevices() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3010/device'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['devices'];
      devices = results.map((e) => Device.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getDevicesByRoomId(String id) async{
    final response = await http.get(Uri.parse('http://10.0.2.2:3010/device'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['devices'];
      results.removeWhere((item) => (item["room_id"]).toString()!=id);
      devices = results.map((e) => Device.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  // Set 'on' for state on and 'off' for state off
  void getDevicesByState(String state) async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3010/device'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['devices'];
      if (state == "on") {
        results.removeWhere((item) => (item["value"]).toString()!= "1");
        devices = results.map((e) => Device.fromJson(e)).toList();
        notifyListeners();
      }
      else if (state == "off") {
        results.removeWhere((item) => (item["value"]).toString()!= "0");
        devices = results.map((e) => Device.fromJson(e)).toList();
        notifyListeners();
      }
      else throw Exception('Unvalid State');
    } else {
      throw Exception('Failed to load data');
    }
  }

  Future<http.Response> addDevice(String name, String category, String room_id) {
    return http.post(
      Uri.parse('http://10.0.2.2:3010/device'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'name': name,
        'category': category,
        'room_id': room_id,

      }),
    );
  }

  Future<http.Response> updateDevice(String deviceName, Device device) {
    return http.put(
      Uri.parse('http://10.0.2.2:3010/device/' + device.id.toString()),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': deviceName,
      }),
    );
  }

  Future<http.Response> updateDeviceValue(int value, Device device) {
    return http.put(
      Uri.parse('http://10.0.2.2:3010/device/' + device.id.toString()),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, int>{
        'value': value,
      }),
    );
  }

  Future<http.Response> deleteDevice(Device device) {
    return http.delete(Uri.parse('http://10.0.2.2:3010/device/' + device.id.toString()));
  }

  void deleteDevice2(Device device) async {
    print(device.id.toString());
    final response = await http.delete(Uri.parse('http://10.0.2.2:3010/device/' + device.id.toString()));
    if (response.statusCode != 200) {
      throw Exception('Failed to load data');
    }
  }
}
