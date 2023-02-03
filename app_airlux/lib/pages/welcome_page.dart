import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/constants.dart';
import 'package:app_airlux/pages/login_page.dart';
import 'package:flutter/material.dart';

import '../widget/delayed_animation.dart';

class WelcomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        elevation: 0,
        backgroundColor: Colors.white.withOpacity(0),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            DelayedAnimation(
              delay: 750,
              child: Hero(
                tag: 'cottage',
                child: Container(
                  height: 280,
                  child: Icon(
                    Icons.cottage,
                    color: kFonceyBlue,
                    size: 170.0,
                  ),
                ),
              ),
            ),
            DelayedAnimation(
              delay: 1000,
              child: Container(
                margin: const EdgeInsets.symmetric(
                  vertical: 70,
                  horizontal: 30,
                ),
                child: Column(
                  children: [
                    Text(
                      "Bienvenue dans Airlux",
                      style: TextStyle(fontSize: 35.0, fontFamily: 'Satisfy'),
                    ),
                  ],
                ),
              ),
            ),
            DelayedAnimation(
              delay: 1250,
              child: Container(
                margin: EdgeInsets.symmetric(
                  vertical: 45,
                  horizontal: 40,
                ),
                child: Column(
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => LoginPage(),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        shape: StadiumBorder(),
                        padding: EdgeInsets.all(13),
                        backgroundColor: kFonceyBlue,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(width: 10),
                          Text(
                            'CONNEXION',
                          )
                        ],
                      ),
                    ),
                    SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => AddBuildingPage(),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        shape: StadiumBorder(),
                        padding: EdgeInsets.all(13),
                        backgroundColor: Colors.white24,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(width: 10),
                          Text(
                            'INSCRIPTION',
                            style: TextStyle(
                              color: kFonceyBlue,
                            ),
                          )
                        ],
                      ),
                    ),
                    SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
