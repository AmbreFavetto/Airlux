import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'scenario.dart';
import 'package:http/http.dart' as http;

class ScenarioData extends ChangeNotifier {
  var str;

  List<Scenario> scenarios = [Scenario(name: 'firstScenario', id: 0)];

  void getAllScenarios() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3000/building'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['buildings'];
      scenarios = results.map((e) => Scenario.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void deleteScenario(Scenario scenario) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:3000/building/' + scenario.id.toString()));
    if (response.statusCode == 200) {
      getAllScenarios();
    } else {
      throw Exception('Failed to load data');
    }
  }
}
