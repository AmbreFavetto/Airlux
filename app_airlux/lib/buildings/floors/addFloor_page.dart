import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:flutter/material.dart';
import '../../constants.dart';
import '../../shared/formBottomButton.dart';
import '../../shared/formInputText.dart';
import 'floors_page.dart';

class AddFloorPage extends StatefulWidget {
  const AddFloorPage({super.key});
  @override
  AddFloorPageState createState() => AddFloorPageState();
}

class AddFloorPageState extends State<AddFloorPage> {
  final _formKey = GlobalKey<FormState>();

  TextEditingController title = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: kFonceyBlue,
        title: const Text('Ajouter un étage'),
      ),
      body: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(width: 10.0, height: 20.0),
              FormInputText(name: title, inputTitle: 'Nom étage', textType: TextInputType.text),
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
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const BuildingsPage(),
                            ));
                      },
                    ),
                    const SizedBox(width: 10.0, height: 0.0),
                    FormBottomButton(
                      title: 'Sauvegarder',
                      onTap: () {
                        if (title.text.isNotEmpty){
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const BuildingsPage()),
                          );
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Étage ajouté.'),
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
    );
  }
}
