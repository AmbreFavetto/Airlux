import 'dart:convert';

import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/models/signup/signup_data.dart';
import 'package:app_airlux/models/user/user_data.dart';
import 'package:app_airlux/pages/login_page.dart';
import 'package:app_airlux/widget/bottomNavigation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants.dart';
import '../widget/delayed_animation.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => SignupPageState();
}

class SignupPageState extends State<SignupPage> {
  var _obscureText = true;
  var str;
  TextEditingController mail = TextEditingController();
  TextEditingController password = TextEditingController();
  TextEditingController confirmPassword = TextEditingController();
  TextEditingController name = TextEditingController();
  TextEditingController forename = TextEditingController();

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
    child: Consumer<SignupData>(
    builder: (context, signupData, child) {
        return Column(
          children: [
            Container(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Hero(
                    tag: 'logo',
                    child: Container(
                      height: 50,
                      child: const Image(
                        image: AssetImage('images/logo.png'),
                      ),
                    ),
                  ),
                  const SizedBox(height: 15),
                  const DelayedAnimation(
                    delay: 50,
                    child: Text(
                      "Inscription",
                      style: TextStyle(
                        fontSize: 35.0,
                        fontFamily: 'Satisfy',
                        color: kDarkPurple,
                      ),
                    ),
                  ),
                  const SizedBox(height: 15),
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
                      controller: name,
                      decoration: InputDecoration(
                        labelText: 'Nom',
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
                      controller: forename,
                      decoration: InputDecoration(
                        labelText: 'Prénom',
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
                      // validator: (value){
                      // print(value)
                      //   if(value!.isEmpty || !RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)){
                      //     ScaffoldMessenger.of(context).showSnackBar(
                      //       const SnackBar(
                      //         content: Text('mail pas ok.'),
                      //       ),
                      //     );
                      //   }
                      // },
                      cursorColor: kDarkPurple,
                      controller: mail,
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
                      controller: password,
                      obscureText: _obscureText,
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
                  const SizedBox(height: 30),
                  DelayedAnimation(
                    delay: 100,
                    child: TextField(
                      // validator: (val) {
                      //   if (val != password.text) {
                      //     return 'Les mots de passes ne correspondent pas.';
                      //   }
                      // },
                      cursorColor: kDarkPurple,
                      controller: confirmPassword,
                      obscureText: _obscureText,
                      decoration: InputDecoration(
                        labelStyle: TextStyle(
                          color: Colors.grey[400],
                        ),
                        labelText: 'Confirmation du mot de passe',
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
                child: const Text('Inscription'),
                onPressed: () async {
                  if(mail.text.isEmpty || password.text.isEmpty || name.text.isEmpty || forename.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Formulaire invalide.'),
                      ),
                    );
                  } else {
                    final response = await signupData.signupUser(mail.text, password.text,name.text, forename.text);
                    if (response.statusCode == 201) {
                      str = json.decode(response.body);
                      token = str['data']['token'];
                      if (token != null) {
                        Navigator.of(context).pushAndRemoveUntil(
                          MaterialPageRoute(
                            builder: (BuildContext context) =>
                                ChangeNotifierProvider(
                                  create: (context) => UserData(),
                                  builder: (context, child) => LoginPage(),
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
                    } else if (response.statusCode == 200) {
                      throw Exception('Failed to load data');
                    }
                  }
                },
              ),
            ),
            const SizedBox(height: 20),
            Align(
              alignment: Alignment.centerRight,
              child: Padding(
                padding: const EdgeInsets.only(right: 35),
                child: TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => LoginPage(),
                      ),
                    );
                  },
                  child: const DelayedAnimation(
                    delay: 100,
                    child: Text("DÉJÀ INSCRIT ? CONNEXION",
                        style: TextStyle(color: kDarkPurple)),
                  ),
                ),
              ),
            ),
          ],
        );}
      ),
    ),);
  }
}
