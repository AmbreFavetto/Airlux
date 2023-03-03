import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:flutter/material.dart';
import '../../constants.dart';
import '../../shared/formBottomButton.dart';
import '../../shared/formInputText.dart';
import '../../shared/titleFormStyle.dart';

class AddRoomPage extends StatefulWidget {
  const AddRoomPage({super.key});
  @override
  AddRoomPageState createState() => AddRoomPageState();
}

class AddRoomPageState extends State<AddRoomPage> {
  final _formKey = GlobalKey<FormState>();

  TextEditingController title = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset : false,
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
                  FormInputText(name: title, inputTitle: 'Nom salle', textType: TextInputType.text),
                  Container(
                    alignment: Alignment.center,
                    padding: const EdgeInsets.all(8),
                    height: 100,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        FormBottomButton(
                          title: 'Sauvegarder',
                          onTap: () {
                            if (title.text.isNotEmpty){
                              Navigator.of(context).push(
                                MaterialPageRoute(builder: (context) => const BuildingsPage()),
                              );
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Salle ajoutée.'),
                                ),
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
