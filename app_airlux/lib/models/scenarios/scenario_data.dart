import 'dart:convert';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter/cupertino.dart';
import 'scenario.dart';
import 'package:http/http.dart' as http;

class ScenarioData extends ChangeNotifier {
  // var prefixUrl = 'http://192.168.1.15';
  var prefixUrl = 'http://10.0.2.2'; // en attendant de réussir à récupérer automatique l'ip de la machine
  var port = 3010;
  var portCloud = 3010;
  var portLocal = 3030;
  var str;
  List<Scenario> scenarios = [];

  Future<bool> checkApiOnline() async {
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    return await response.statusCode == 200 ? true : false ;
  }

  void getAllScenarios() async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/scenario'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['scenarios'];
      scenarios = results.map((e) => Scenario.fromJson(e)).toList();
      notifyListeners();
    } else if (response.statusCode == 404) {
      scenarios = <Scenario>[];
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

  Future<http.Response> addScenario(String name) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

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
  Future<http.Response> modifyScenarioName(Scenario scenario, String name) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

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
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.delete(Uri.parse('${prefixUrl}:${port.toString()}/scenario/${scenario.id.toString()}'));
    if (response.statusCode == 200) {
      notifyListeners();
      return true;
    } else {
      return false;
    }
  }
}
