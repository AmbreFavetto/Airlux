import 'package:flutter/material.dart';

import '../constants.dart';

class DownButton extends StatelessWidget {
  const DownButton({
    Key? key,
  }) : super(key: key);



  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      backgroundColor: kRed,
      onPressed: () { ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Impossible d\'ajouter en déplacement'),
          ) );},
      child: const Icon(Icons.add),
    );
  }
}