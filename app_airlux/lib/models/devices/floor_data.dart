import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'device.dart';
import 'package:http/http.dart' as http;

import 'package:app_airlux/models/devices/floor.dart';

class FloorData extends ChangeNotifier {
  var str;

  List<Floor> floors = [Floor(building_id: 0,number: 2, id: 0)];

  void getFloorsFromBuilding(int? id) async{
    final response = await http.get(Uri.parse('http://10.0.2.2:3000/floor/'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['floors'];
      results.removeWhere((item) => item["building_id"]!=id);
      floors = results.map((e) => Floor.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }
}
