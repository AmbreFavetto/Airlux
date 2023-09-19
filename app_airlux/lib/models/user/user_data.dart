import 'dart:convert';

import 'package:app_airlux/constants.dart';
import 'package:flutter/cupertino.dart';
import 'user.dart';
import 'package:http/http.dart' as http;

class UserData extends ChangeNotifier {
  var str;
  var portCloud = 3010;
  var portLocal = 3030;
  var port = 3010;
  //var prefixUrl = 'http://192.168.1.96';
  var prefixUrl = 'http://10.0.2.2';

  List<User> user = [];

  void checkApiLocalAvailable() async {
    try {
      final response = await http.get(Uri.parse('${prefixUrl}:${portLocal.toString()}/health'), headers: header("0"));
      if (await response.statusCode == 200)
        apiIsOnline = true;
      else apiIsOnline = false;
    }
    catch(e){
      apiIsOnline = false;
    }
  }

  Future<bool> checkApiOnline() async {
    checkApiLocalAvailable();
    var port = 3010;
    final response = await http.get(Uri.parse('${prefixUrl}:${port.toString()}/health'));
    if (await response.statusCode == 200) {
      //final syncResponse = await http.post(Uri.parse('${prefixUrl}:${portLocal.toString()}/send'));
      return true;
    }
    else return false;
  }

  Future<http.Response> loginUser(String email, String password) async {
    checkApiLocalAvailable();
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

}
