import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
          child: Container(
        padding: const EdgeInsets.all(10.0),
        child: Column(children: [
          SizedBox(
            width: 120,
            height: 120,
            child: const Icon(Icons.person),
          ),
          Text('Bonjour'),
          Text('email'),
          SizedBox(height: 20),
          ElevatedButton(onPressed: (){}, child: Text('clic'))
        ]),
      )),
    );
  }
}
