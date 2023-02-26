import 'dart:convert';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter/cupertino.dart';
import 'scenario.dart';
import 'package:http/http.dart' as http;

class ScenarioData extends ChangeNotifier {

  late IO.Socket _socket;

  var str;
  List<Scenario> scenarios = [Scenario(name: 'firstScenario', id: '0')];

  void getAllScenarios() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:3000/scenario'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['scenarios'];
      scenarios = results.map((e) => Scenario.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }

  Future<http.Response> addScenario(String name) {
    return http.post(
      Uri.parse('http://10.0.2.2:3000/scenario'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': name,
        'device_id': '1' //TODO modify with real value
      }),
    );
  }

  Future<bool> deleteScenario(Scenario scenario) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:3000/scenario/' + scenario.id.toString()));
    if (response.statusCode == 200) {
      notifyListeners();
      return true;
    } else {
      throw Exception('Failed to load data');
    }
  }
}
