import 'package:app_airlux/scenarios/configureScenario_page.dart';
import 'package:app_airlux/scenarios/scenarios_page.dart';
import 'package:app_airlux/shared/formInputText.dart';
import 'package:app_airlux/shared/titleFormStyle.dart';
import 'package:flutter/material.dart';
import '../shared/formBottomButton.dart';
import 'package:app_airlux/models/scenarios/scenario_data.dart';

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
                  FormInputText(name: name, inputTitle: 'Nom du scénario', textType: TextInputType.text),
                  Container(
                    alignment: Alignment.center,
                    padding: const EdgeInsets.all(8),
                    height: 100,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        FormBottomButton(
                          title: 'Retour',
                          onTap: () {
                            Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) => const ScenariosPage(),
                                ));
                          },
                        ),
                        const SizedBox(width: 10.0, height: 0.0),
                        FormBottomButton(
                          title: 'Suivant',
                          onTap: () async {
                            if (name.text.isNotEmpty){
                              //http.Response response = await addScenario("Bob", "engineer");
                              Navigator.of(context).push(
                                MaterialPageRoute(builder: (context) => const ConfigureScenarioPage()),
                              );

                            }
                            else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Formulaire invalide.'),
                                ),
                              );
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              )),
        ],
      ),
    );
  }
}
