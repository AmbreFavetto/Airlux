import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'device.dart';
import 'package:http/http.dart' as http;

class DeviceData extends ChangeNotifier {
  var str;

  List<Device> devices = [Device(name: 'firstDevice', id: 1, room_id: 1), Device(name: 'secondDevice', id: 2, room_id: 2)];

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
      results.removeWhere((item) => item["room_id"]!=id);
      devices = results.map((e) => Device.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void deleteDevice(Device device) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:3010/device' + device.id.toString()));
    if (response.statusCode == 200) {
      getAllDevices();
    } else {
      throw Exception('Failed to load data');
    }
  }
}
