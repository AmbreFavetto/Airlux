import 'package:app_airlux/constants.dart';
import 'package:app_airlux/pages/signup_page.dart';
import 'package:flutter/material.dart';
import '../widget/delayed_animation.dart';

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});

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
                tag: 'logo',
                child: Container(
                  height: 250,
                  child: const Image(
                    image: AssetImage('images/logo.png'),
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
                  children: const [
                    Text(
                      "Bienvenue dans Airlux",
                      style: TextStyle(
                        fontSize: 35.0,
                        fontFamily: 'Satisfy',
                        color: kDarkPurple,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            DelayedAnimation(
              delay: 1250,
              child: Container(
                margin: const EdgeInsets.symmetric(
                  vertical: 45,
                  horizontal: 40,
                ),
                child: Column(
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pushNamed('/login');
                      },
                      style: ElevatedButton.styleFrom(
                        shape: const StadiumBorder(),
                        padding: const EdgeInsets.all(13),
                        backgroundColor: kDarkPurple,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          SizedBox(width: 10),
                          Text(
                            'CONNEXION',
                          )
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const SignupPage(),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        shape: const StadiumBorder(),
                        padding: const EdgeInsets.all(13),
                        backgroundColor: Colors.white24,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          SizedBox(width: 10),
                          Text(
                            'INSCRIPTION',
                            style: TextStyle(
                              color: kDarkPurple,
                            ),
                          )
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
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
