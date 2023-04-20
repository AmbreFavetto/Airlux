import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'device.dart';
import 'package:http/http.dart' as http;

class DeviceData extends ChangeNotifier {
  var str;

  List<Device> devices = [Device(name: 'firstDevice', id: 1, room_id: 1, category:'lamp'), Device(name: 'secondDevice', id: 2, room_id: 2, category:'lamp_rgb'), Device(name: 'trois', id: 3, room_id: 2, category:'blind'), Device(name: 'quatre', id: 4, room_id: 2, category:'radiator'), Device(name: 'cinq', id: 5, room_id: 2, category:'air_conditioning')];

  void getAllDevices() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3000/device'));
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
    final response = await http.get(Uri.parse('http://10.0.2.2:3000/device'));
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
    final response = await http.delete(Uri.parse('http://10.0.2.2:3000/device' + device.id.toString()));
    if (response.statusCode == 200) {
      getAllDevices();
    } else {
      throw Exception('Failed to load data');
    }
  }
}
