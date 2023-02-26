//import 'package:app_airlux/scenarios/configureScenario_page.dart';
import 'package:app_airlux/models/scenarios/scenario_data.dart';
import 'package:app_airlux/scenarios/scenarios_page.dart';
import 'package:app_airlux/shared/formInputText.dart';
import 'package:app_airlux/shared/titleFormStyle.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/formBottomButton.dart';
import 'package:http/http.dart' as http;

class AddScenarioPage extends StatefulWidget {
  const AddScenarioPage({super.key});
  @override
  AddScenarioPageState createState() => AddScenarioPageState();
}

class AddScenarioPageState extends State<AddScenarioPage> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController name = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Column(
        children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitleFormStyle(text: "Ajouter un scénario"),
          Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(width: 10.0, height: 20.0),
                  FormInputText(
                      name: name,
                      inputTitle: 'Nom du scénario',
                      textType: TextInputType.text),
                  SizedBox(
                    height: 30,
                  ),
                  Consumer<ScenarioData>(
                    builder: (context, scenarioData, child) {
                      return FormBottomButton(
                        title: 'Sauvegarder',
                        onTap: () async {
                          if (name.text.isNotEmpty) {
                            http.Response response =
                                await scenarioData.addScenario(name.text);
                            if (response.statusCode == 201) {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const ScenariosPage()), //add ConfigureScenarioPage() when ready
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Ajout de scenario impossible.'),
                                ),
                              );
                            }
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Formulaire invalide.'),
                              ),
                            );
                          }
                        },
                      );
                    },
                  )
                ],
              )),
        ],
      ),
    );
  }
}
