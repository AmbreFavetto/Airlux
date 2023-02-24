import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:app_airlux/models/scenarios/scenario_data.dart';
import '../buildings/buildings_page.dart';
import '../constants.dart';
import '../shared/formBottomButton.dart';

class AddDeviceToScenarioPage extends StatefulWidget {
  const AddDeviceToScenarioPage({super.key});
  @override
  AddDeviceToScenarioPageState createState() => AddDeviceToScenarioPageState();
}

class AddDeviceToScenarioPageState extends State<AddDeviceToScenarioPage> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController nameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(

        title: const Text('Ajouter un scenario'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Padding(
            padding: EdgeInsets.all(15),
            child: TextField(
              controller: nameController,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Scenario name',
                hintText: 'Enter Your Scenario name',
              ),
            ),
          ),
          FormBottomButton(
            title: 'Suivant',
            onTap: () {
              Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AddDeviceToScenarioPage(),
                  ));
            },
          )
        ],
      ),
    );
  }
}
