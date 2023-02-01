import 'package:flutter/material.dart';

import '../constants.dart';

class FormBottomButton extends StatelessWidget {
  const FormBottomButton({
    Key? key,
    required this.title,
    required this.onTap,
  }) : super(key: key);

  final String title;
  final void Function() onTap;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: kFonceyBlue,
      ),
      onPressed: onTap,
      child: Text(title),
    );
  }
}