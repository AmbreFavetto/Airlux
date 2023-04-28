import 'package:app_airlux/shared/titleFormStyle.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/buildings/building_data.dart';
import '../shared/formInputText.dart';
import '../shared/formBottomButton.dart';
import 'buildings_page.dart';
import 'package:http/http.dart' as http;

class AddBuildingPage extends StatefulWidget {
  const AddBuildingPage({super.key});
  @override
  AddBuildingPageState createState() => AddBuildingPageState();
}

class AddBuildingPageState extends State<AddBuildingPage> {
  final _formKey = GlobalKey<FormState>();

  TextEditingController title = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Column(
        children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitleFormStyle(text: "Ajouter un bâtiment"),
          Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(width: 10.0, height: 20.0),
                FormInputText(
                  name: title,
                  inputTitle: 'Nom du bâtiment',
                  textType: TextInputType.text,
                ),
                const SizedBox(
                  height: 30,
                ),
                Consumer<BuildingData>(
                  builder: (context, buildingData, child) {
                    return FormBottomButton(
                      title: 'Sauvegarder',
                      onTap: () async {
                        if (title.text.isNotEmpty) {
                          http.Response response =
                              await buildingData.addBuilding(title.text);
                          if (response.statusCode == 201) {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                  builder: (context) =>
                                      const BuildingsPage()), //add ConfigureScenarioPage() when ready
                            );
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Le bâtiment a été ajouté.'),
                              ),
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Ajout de bâtiment impossible.'),
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
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
