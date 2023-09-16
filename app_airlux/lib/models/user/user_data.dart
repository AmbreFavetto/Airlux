import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'user.dart';
import 'package:http/http.dart' as http;

class UserData extends ChangeNotifier {
  var str;
  //var prefixUrl = 'http://192.168.1.29';
  var prefixUrl = 'http://10.0.2.2'; // en attendant de réussir à récupérer automatique l'ip de la machine
  var portCloud = 3010;
  var portLocal = 3030;
  var port = 3010;
  List<User> user = [];

  Future<bool> checkApiOnline() async {
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    return await response.statusCode == 200 ? true : false ;
  }

  Future<http.Response> loginUser(String email, String password) async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    return http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/user/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'email': email,
        'password': password
      }),
    );
  }





  void getAllDevices() async {
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/device'));
    if (response.statusCode == 200) {
      str = json.decode(response.body);
      final List<dynamic> results = str['data']['devices'];
      user = results.map((e) => User.fromJson(e)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load data');
    }
  }
}
