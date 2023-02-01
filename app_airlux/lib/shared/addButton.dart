import 'package:flutter/material.dart';

import '../constants.dart';

class AddButton extends StatelessWidget {
  const AddButton({
    Key? key,
    required this.title,
    required this.onTap,
  }) : super(key: key);

  final String title;
  final void Function() onTap;

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: onTap,
      tooltip: title,
      backgroundColor: kFonceyBlue,
      child: const Icon(Icons.add),
    );
  }
}