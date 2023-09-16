import 'package:app_airlux/pages/cgu_page.dart';
import 'package:flutter/material.dart';
import 'package:app_airlux/constants.dart';

class SettingPage extends StatelessWidget {
  const SettingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(10.0),
          child: Column(children: [
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const CguPage(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                shape: const StadiumBorder(),
                padding: const EdgeInsets.all(13),
                backgroundColor: kOrange,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(width: 10),
                  Text(
                    'BLUETOOTH',
                    style: TextStyle(
                      color: kDarkPurple,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const CguPage(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                shape: const StadiumBorder(),
                padding: const EdgeInsets.all(13),
                backgroundColor: kOrange,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(width: 10),
                  Text(
                    'CGU',
                    style: TextStyle(
                      color: kDarkPurple,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
          ]),
        ),
      ),
    );
  }
}
