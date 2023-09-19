import 'dart:convert';

import 'package:app_airlux/constants.dart';
import 'package:app_airlux/models/signup/signup.dart';
import 'package:flutter/cupertino.dart';

import 'package:http/http.dart' as http;

class SignupData extends ChangeNotifier {
  var str;

  var portCloud = 3010;
  var portLocal = 3030;
  var port = 3010;
  //var prefixUrl = 'http://192.168.1.96';
  var prefixUrl = 'http://10.0.2.2';

  List<Signup> user = [];

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

  //TODO synchro OK
  Future<bool> synchronizeLocalSignup(String email, String password, String name, String forename, String userCreatedId) async {
    checkApiLocalAvailable();
    final response = await http.post(
      Uri.parse('${prefixUrl}:${portLocal.toString()}/user'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'forename': forename,
        'name': name,
        'email': email,
        'password': password,
        'user_id': userCreatedId
      }),
    );
    if (await response.statusCode != 201)
      throw Exception('Failed to load data');
    return true;
  }

  Future<http.Response> signupUser(String email, String password, String name, String forename) async {
    String sync ="1";
    if (await checkApiOnline() == false) port = portLocal;
    else port = portCloud;

    final response = await http.post(
      Uri.parse('${prefixUrl}:${port.toString()}/user'), headers: headerLessToken(sync),
      body: jsonEncode({
        'name': name,
        'forename': forename,
        'email': email,
        'password': password
      }),
    );

    if (await response.statusCode == 201) {
      str = json.decode(response.body);
      final String userCreatedId = str['data']['id'];
      //Synchro with local (if added in cloud)
      if (port != portLocal) {
        //await synchronizeLocalSignup(email, password, name, forename, userCreatedId);
      }
    }
    return response;
  }
}
