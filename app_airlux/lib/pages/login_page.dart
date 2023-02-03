import 'package:app_airlux/pages/home_page.dart';
import 'package:flutter/material.dart';

import '../constants.dart';
import '../widget/delayed_animation.dart';

class LoginPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white.withOpacity(0),
        leading: IconButton(
          icon: Icon(
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
        child: Column(
          children: [
            Container(
              margin: EdgeInsets.symmetric(
                vertical: 40,
                horizontal: 30,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Hero(
                      tag: 'cottage',
                      child: Container(
                        height: 160,
                        child: Icon(
                          Icons.cottage,
                          color: kFonceyBlue,
                          size: 130.0,
                        ),
                      ),
                    ),
                  DelayedAnimation(
                    delay: 50,
                    child: Text(
                      "Connexion",
                      style: TextStyle(fontSize: 35.0, fontFamily: 'Satisfy'),
                    ),
                  )
                ],
              ),
            ),
            LoginForm(),
            SizedBox(height: 45),
            DelayedAnimation(
              delay: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  shape: StadiumBorder(),
                  padding: EdgeInsets.symmetric(
                    horizontal: 125,
                    vertical: 13,
                  ),
                  backgroundColor: kFonceyBlue,
                ),
                child: Text('CONNEXION'),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => HomePage(),
                    ),
                  );
                },
              ),
            ),
            SizedBox(height: 90),
            Align(
              alignment: Alignment.centerRight,
              child: Padding(
                padding: EdgeInsets.only(right: 35),
                child: TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: DelayedAnimation(
                    delay: 100,
                    child: Text("PAS DE COMPTE ? INSCRIPTION",
                        style: TextStyle(color: kFonceyBlue)),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class LoginForm extends StatefulWidget {
  @override
  _LoginFormState createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  var _obscureText = true;
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(
        horizontal: 30,
      ),
      child: Column(
        children: [
          DelayedAnimation(
            delay: 100,
            child: TextField(
              decoration: InputDecoration(
                labelText: 'Adresse mail',
                labelStyle: TextStyle(
                  color: Colors.grey[400],
                ),
              ),
            ),
          ),
          SizedBox(height: 30),
          DelayedAnimation(
            delay: 100,
            child: TextField(
              obscureText: _obscureText,
              decoration: InputDecoration(
                labelStyle: TextStyle(
                  color: Colors.grey[400],
                ),
                labelText: 'Mot de passe',
                suffixIcon: IconButton(
                  icon: Icon(
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
    );
  }
}
