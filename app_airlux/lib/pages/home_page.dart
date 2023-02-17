import 'package:app_airlux/constants.dart';
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    // return Scaffold(
    //   body: Column(
    //     mainAxisAlignment: MainAxisAlignment.center,
    //     children: const [
    //       Text('Bienvenue user'),
    //     ],
    //   ),
    // );
    return Container(
      margin: const EdgeInsets.only(bottom: 20.0 * 2.5),
      // It will cover 20% of our total height
      height: MediaQuery.of(context).size.height * 0.2,
      child: Stack(
        children: <Widget>[
          Container(
            padding: const EdgeInsets.only(
              left: 20.0,
              right: 20.0,
              bottom: 36 + 20.0,
            ),
            height: MediaQuery.of(context).size.height * 0.2 - 27,
            decoration: const BoxDecoration(
              color: kDarkPurple,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(36),
                bottomRight: Radius.circular(36),
              ),
            ),
            child: Row(
              children: <Widget>[
                Text(
                  'Accueil',
                  style: Theme.of(context).textTheme.headline5?.copyWith(
                      color: Colors.white, fontWeight: FontWeight.bold),
                ),
                const Spacer(),
                Hero(
                  tag: 'logo',
                  child: Container(
                    margin: const EdgeInsets.only(right: 15.0),
                    child: const Image(
                      image: AssetImage('images/logo.png'),
                      width: 100,
                      //height: 20,
                    ),
                  ),
                )
                //Image.asset("assets/images/logo.png")
              ],
            ),
          ),
        ],
      ),
    );
  }
}
