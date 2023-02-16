import 'package:flutter/material.dart';

class AlertPopUp extends StatelessWidget {
  const AlertPopUp({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
          title: const Text('AlertDialog Title'),
          content: const Text('AlertDialog description'),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.pop(context, 'OK'),
              child: const Text('OK'),
            ),
          ],
        );
  }
}