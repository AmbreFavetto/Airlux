import 'package:flutter/material.dart';
import '../main.dart';

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
              const SizedBox(width: 10.0, height: 10.0),
              InputText(name: title, inputTitle: 'Nom du bâtiment'),
              Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.all(8),
                height: 100,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF003b71),
                      ),
                      child: const Text('Retour'),
                      onPressed: () => {
                        if (title.text.isNotEmpty)
                          {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => MyApp()),
                            ),
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Le bâtiment a été ajouté.'),
                              ),
                            ),
                          }
                        else
                          {
                            print('pas ok'),
                          }
                      },
                    ),
                    const SizedBox(width: 10.0, height: 0.0),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF003b71),
                      ),
                      child: const Text('Sauvegarder'),
                      onPressed: () => {
                        if (title.text.isNotEmpty)
                          {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => MyApp()),
                            ),
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Le bâtiment a été ajouté.'),
                              ),
                            ),
                          }
                        else
                          {
                            print('pas ok'),
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

class InputText extends StatelessWidget {
  const InputText({
    Key? key,
    required this.name,
    required this.inputTitle,
  }) : super(key: key);

  final TextEditingController name;
  final String inputTitle;

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: const EdgeInsets.only(left: 20.0, right: 20.0),
        alignment: Alignment.centerLeft,
        decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            boxShadow: const [
              BoxShadow(color: Colors.black26, offset: Offset(0, 2))
            ]),
        height: 50,
        child: TextField(
            controller: name,
            keyboardType: TextInputType.emailAddress,
            style: const TextStyle(color: Colors.black87),
            textAlign: TextAlign.center,
            decoration: InputDecoration(
                border: InputBorder.none,
                contentPadding: const EdgeInsets.only(top: 14),
                hintText: inputTitle,
                hintStyle: const TextStyle(color: Colors.black38))));
  }
}
