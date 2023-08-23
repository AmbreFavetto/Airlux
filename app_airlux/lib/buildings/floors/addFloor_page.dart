import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:app_airlux/buildings/floors/floors_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/buildings/floors/floor_data.dart';
import '../../shared/formBottomButton.dart';
import '../../shared/formInputText.dart';
import '../../shared/titleFormStyle.dart';
import 'package:http/http.dart' as http;

class AddFloorPage extends StatefulWidget {
  const AddFloorPage(
      {super.key, required this.building_id, required this.building_name});
  final String building_id;
  final String building_name;
  @override
  _AddFloorPageState createState() =>
      _AddFloorPageState();
}

class _AddFloorPageState extends State<AddFloorPage> {
  final _formKey = GlobalKey<FormState>();

  TextEditingController title = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Column(
        children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitleFormStyle(text: "Ajouter un étage"),
          Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(width: 10.0, height: 20.0),
                  FormInputText(
                    name: title,
                    inputTitle: 'Nom étage',
                    textType: TextInputType.text,
                  ),
                  Container(
                    alignment: Alignment.center,
                    padding: const EdgeInsets.all(8),
                    height: 100,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Consumer<FloorData>(
                          builder: (context, floorData, child) {
                            return FormBottomButton(
                              title: 'Sauvegarder',
                              onTap: () async {
                                if (title.text.isNotEmpty) {
                                  http.Response response = await floorData
                                      .addFloor(title.text, widget.building_id);
                                  if (response.statusCode == 201) {
                                    Navigator.of(context).push(
                                      MaterialPageRoute(
                                          builder: (context) => FloorsPage(
                                                buildingName: widget.building_name,
                                                buildingId: widget.building_id,
                                              )), //add ConfigureScenarioPage() when ready
                                    );
                                  } else {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content:
                                            Text("Ajout de l'étage impossible"),
                                      ),
                                    );
                                  }
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Formulaire invalide'),
                                    ),
                                  );
                                }
                              },
                            );
                          },
                        )
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
