import 'dart:convert';

import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/models/user/user.dart';
import 'package:app_airlux/models/user/user_data.dart';
import 'package:app_airlux/pages/home_page.dart';
import 'package:app_airlux/widget/bottomNavigation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants.dart';
import '../widget/delayed_animation.dart';
import 'package:app_airlux/pages/signup_page.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  TextEditingController email = TextEditingController();
  TextEditingController password = TextEditingController();
  var _obscureText = true;
  var str;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white.withOpacity(0),
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Colors.black,
            size: 30,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: SingleChildScrollView(
        child: Consumer<UserData>(
          builder: (context, userData, child) {
            return Column(
              children: [
                Container(
                  margin: const EdgeInsets.symmetric(
                    vertical: 40,
                    horizontal: 30,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Hero(
                        tag: 'logo',
                        child: Container(
                          height: 120,
                          child: const Image(
                            image: AssetImage('images/logo.png'),
                          ),
                        ),
                      ),
                      const SizedBox(height: 25),
                      const DelayedAnimation(
                        delay: 50,
                        child: Text(
                          "Connexion",
                          style: TextStyle(
                            fontSize: 35.0,
                            fontFamily: 'Satisfy',
                            color: kDarkPurple,
                          ),
                        ),
                      )
                    ],
                  ),
                ),
                Container(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 30,
                  ),
                  child: Column(
                    children: [
                      DelayedAnimation(
                        delay: 100,
                        child: TextField(
                          cursorColor: kDarkPurple,
                          controller: email,
                          decoration: InputDecoration(
                            labelText: 'Adresse mail',
                            labelStyle: TextStyle(
                              color: Colors.grey[400],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 30),
                      DelayedAnimation(
                        delay: 100,
                        child: TextField(
                          cursorColor: kDarkPurple,
                          obscureText: _obscureText,
                          controller: password,
                          decoration: InputDecoration(
                            labelStyle: TextStyle(
                              color: Colors.grey[400],
                            ),
                            labelText: 'Mot de passe',
                            suffixIcon: IconButton(
                              icon: const Icon(
                                Icons.visibility,
                                color: Colors.black,
                              ),
                              onPressed: () {
                                setState(() {
                                  _obscureText = !_obscureText;
                                });
                              },
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 45),
                DelayedAnimation(
                  delay: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      shape: const StadiumBorder(),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 125,
                        vertical: 13,
                      ),
                      backgroundColor: kDarkPurple,
                    ),
                    child: const Text('CONNEXION'),
                    onPressed: () async {
                      if (email.text.isEmpty ||  password.text.isEmpty){
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Formulaire invalide.'),
                          ),
                        );
                      } else {
                        final response =
                        await userData.loginUser(email.text, password.text);
                        if (response.statusCode == 200) {
                          str = json.decode(response.body);
                          token = str['data']['token'];
                          userId = str['data']['user_id'];
                          if (token != null) {
                            Navigator.of(context).pushAndRemoveUntil(
                              MaterialPageRoute(
                                builder: (BuildContext context) =>
                                    ChangeNotifierProvider(
                                      create: (context) => DeviceData(),
                                      builder: (context, child) => BottomNavigation(),
                                    ),
                              ),
                                  (Route<dynamic> route) => false,
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Connexion impossible'),
                              ),
                            );
                          }
                        } else if (response.statusCode != 200) {
                          throw Exception('Failed to load data');
                        }
                      }
                    },
                  ),
                ),
                const SizedBox(height: 90),
                Align(
                  alignment: Alignment.centerRight,
                  child: Padding(
                    padding: const EdgeInsets.only(right: 35),
                    child: TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const SignupPage(),
                          ),
                        );
                      },
                      child: const DelayedAnimation(
                        delay: 100,
                        child: Text("PAS DE COMPTE ? INSCRIPTION",
                            style: TextStyle(color: kDarkPurple)),
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
