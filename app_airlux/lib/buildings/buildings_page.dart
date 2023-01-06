import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:app_airlux/shared/bottomButton.dart';
import 'package:flutter/material.dart';

class BuildingsPage extends StatefulWidget {
  const BuildingsPage({super.key});
  @override
  BuildingsPageState createState() => BuildingsPageState();
}

class BuildingsPageState extends State<BuildingsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Batiments'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          SizedBox(height: 10.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              BottomButton(
                title: 'Ajouter un batiment',
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const AddBuildingPage(),
                      ));
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}
