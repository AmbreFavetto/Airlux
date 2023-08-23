import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:app_airlux/buildings/rooms/rooms_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants.dart';
import '../../models/buildings/rooms/room_data.dart';
import '../../shared/formBottomButton.dart';
import '../../shared/formInputText.dart';
import '../../shared/titleFormStyle.dart';
import 'package:http/http.dart' as http;

class AddRoomPage extends StatefulWidget {
  const AddRoomPage(
      {super.key, required this.floor_id, required this.floor_name});
  final String floor_id;
  final String floor_name;
  @override
  _AddRoomPageState createState() => _AddRoomPageState();
}

class _AddRoomPageState extends State<AddRoomPage> {
  final _formKey = GlobalKey<FormState>();

  TextEditingController title = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Column(
        children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitleFormStyle(text: "Ajouter une salle"),
          Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(width: 10.0, height: 20.0),
                FormInputText(
                  name: title,
                  inputTitle: 'Nom salle',
                  textType: TextInputType.text,
                ),
                Container(
                  alignment: Alignment.center,
                  padding: const EdgeInsets.all(8),
                  height: 100,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Consumer<RoomData>(
                        builder: (context, roomData, child) {
                          return FormBottomButton(
                            title: 'Sauvegarder',
                            onTap: () async {
                              if (title.text.isNotEmpty) {
                                http.Response response = await roomData.addRoom(
                                    title.text, widget.floor_id);
                                if (response.statusCode == 201) {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                        builder: (context) => RoomsPage(
                                              floorNumber: widget.floor_name,
                                              floorId: widget.floor_id,
                                            )), //add ConfigureScenarioPage() when ready
                                  );
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content:
                                          Text("Ajout de la pièce impossible"),
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
            ),
          ),
        ],
      ),
    );
  }
}
