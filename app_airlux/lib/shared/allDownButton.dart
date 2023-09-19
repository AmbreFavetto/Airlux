import 'package:flutter/material.dart';

import '../constants.dart';

class AllDownButton extends StatelessWidget {
  const AllDownButton({
    Key? key,
  }) : super(key: key);



  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      backgroundColor: kRed,
      onPressed: () { ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Vous êtes déconnecté'),
          ) );},
      child: const Icon(Icons.add),
    );
  }
}