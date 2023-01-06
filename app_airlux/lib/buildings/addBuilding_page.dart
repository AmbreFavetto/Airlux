import 'package:flutter/material.dart';
import '../main.dart';
import '../shared/formInputText.dart';
import '../shared/bottomButton.dart';

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
      appBar: AppBar(
        title: const Text('Ajouter un bâtiment'),
      ),
      body: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(width: 10.0, height: 20.0),
              FormInputText(name: title, inputTitle: 'Nom du bâtiment'),
              Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.all(8),
                height: 100,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    BottomButton(
                      title: 'Retour',
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const MyApp(),
                            ));
                      },
                    ),
                    const SizedBox(width: 10.0, height: 0.0),
                    BottomButton(
                      title: 'Sauvegarder',
                      onTap: () {
                        if (title.text.isNotEmpty){
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const MyApp()),
                          );
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Le bâtiment a été ajouté.'),
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
