import 'dart:developer';
import 'package:app_airlux/models/scenarios/scenario.dart';
import 'package:app_airlux/models/scenarios/scenario_data.dart';
import 'package:app_airlux/scenarios/scenarios_page.dart';
import 'package:app_airlux/shared/formInputText.dart';
import 'package:app_airlux/shared/titleFormStyle.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/formBottomButton.dart';
import 'package:http/http.dart' as http;

class ConfigureScenarioPage extends StatefulWidget {
  const ConfigureScenarioPage({super.key, required this.scenario});
  final Scenario scenario;
  @override
  ConfigureScenarioPageState createState() => ConfigureScenarioPageState();
}

class ConfigureScenarioPageState extends State<ConfigureScenarioPage> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController title = TextEditingController();
  static TextEditingController name = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        body: Column(children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitleFormStyle(text: "Modifier un scénario"),
          Form(
              key: _formKey,
              child: Consumer<ScenarioData>(
                  builder: (context, scenarioData, child) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(width: 10.0, height: 20.0),
                    FormInputText(
                      name: name,
                      inputTitle: widget.scenario.name.toString(),
                      textType: TextInputType.text,
                    ),
                    SizedBox(
                      height: 30,
                    ),
                    FormBottomButton(
                      title: 'Sauvegarder',
                      onTap: () async {
                        if (name.text.isNotEmpty) {
                          http.Response response = await scenarioData
                              .modifyScenarioName(widget.scenario, name.text);
                          log('data: $response.statusCode');
                          if (response.statusCode == 200) {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                  builder: (context) =>
                                      const ScenariosPage()), //add ConfigureScenarioPage() when ready
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                    'Modification de scenario impossible.'),
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
                    ),
                  ],
                );
              })),
        ]));
  }
}
