import 'dart:convert';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter/cupertino.dart';
import 'scenario.dart';
import 'package:http/http.dart' as http;

class ScenarioData extends ChangeNotifier {

  //late IO.Socket _socket;
  //var prefixUrl = 'http://192.168.1.29';
  var prefixUrl = 'http://10.0.2.2'; // en attendant de réussir à récupérer automatique l'ip de la machine
  var port = 3010;
  var str;
  List<Scenario> scenarios = [Scenario(name: 'firstScenario', id: '0'), Scenario(name: 'secondScenario', id: '1'), Scenario(name: 'thirdScenario', id: '2')];

  Future<bool> checkApiOnline() async {
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/scenario'));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  void getAllScenarios() async {
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/scenario'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['scenarios'];
      scenarios = results.map((e) => Scenario.fromJson(e)).toList();
      notifyListeners();
    } else {
      if (checkApiOnline() == true) {
        throw Exception('Failed to load data');
      }
      else {
        throw Exception("Database API is not online");
      }
    }
  }

  Future<http.Response> addScenario(String name) {
    return http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/scenario'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': name,
      }),
    );
  }
  Future<http.Response> modifyScenarioName(Scenario scenario, String name) {
    return http.put(
      Uri.parse('${prefixUrl}:${port.toString()}/scenario/${scenario.id.toString()}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'name': name,
      }),
    );
  }

  Future<bool> deleteScenario(Scenario scenario) async {
    final response = await http.delete(Uri.parse('${prefixUrl}:${port.toString()}/scenario/${scenario.id.toString()}'));
    if (response.statusCode == 200) {
      notifyListeners();
      return true;
    } else {
      return false;
    }
  }
}
