import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'device.dart';
import 'package:http/http.dart' as http;

class DeviceData extends ChangeNotifier {
  var str;

  List<Device> devices = [Device(name: 'firstDevice', category: 'actuator', room_id: '1', value: 1), Device(name: 'secondDevice', category: 'sensor', room_id: '2', value:  1)];

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

  Future<http.Response> addDevice(String name, String category, String room_id) {
    print(name);
    print(category);
    print(room_id);
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
    print(device.id.toString());
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
