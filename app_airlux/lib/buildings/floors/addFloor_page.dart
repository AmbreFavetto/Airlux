import 'package:flutter/material.dart';

class AddFloorPage extends StatelessWidget {
  static const String title = 'Ajouter un étage';

  @override
  Widget build(BuildContext context) => Scaffold(
    // changer el nom avec la classe qui permet la navigation
    //drawer: NavigationDrawerWidget(),
    appBar: AppBar(
      title: const Text(AddFloorPage.title),
      centerTitle: true,
      backgroundColor: const Color(0x009fc5e8),
    ),
  );
}

class buildForm extends StatefulWidget {
  @override
  _buildForm createState() => _buildForm();
}

class _buildForm extends State<buildForm> {
  TextEditingController name = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Container(
            alignment: Alignment.centerLeft,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, offset: Offset(0, 2))
                ]),
            height: 60,
            child: TextField(
                controller: name,
                keyboardType: TextInputType.text,
                style: TextStyle(color: Colors.black87),
                decoration: InputDecoration(
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.only(top: 14),
                    prefixIcon: Icon(Icons.business, color: Colors.black),
                    hintText: 'Nom de l\'étage',
                    hintStyle: TextStyle(color: Colors.black38)))),
      ],
    );
  }
}
