import 'package:flutter/material.dart';
import '../constants.dart';
import '../shared/formInputText.dart';
import '../shared/formBottomButton.dart';
import 'buildings_page.dart';

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
        backgroundColor: kDarkPurple,
        title: const Text('Ajouter un bâtiment'),
        actions: [
          Hero(
            tag: 'cottage',
            child: Container(
              margin: EdgeInsets.only(right: 15.0),
              child: Icon(
                Icons.cottage,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
      body: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(width: 10.0, height: 20.0),
              FormInputText(name: title, inputTitle: 'Nom du bâtiment', textType: TextInputType.text),
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
                              builder: (context) => const BuildingsPage(),
                            ));
                      },
                    ),
                    const SizedBox(width: 10.0, height: 0.0),
                    FormBottomButton(
                      title: 'Sauvegarder',
                      onTap: () {
                        if (title.text.isNotEmpty){
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (context) => const BuildingsPage()),
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
