import 'package:flutter/material.dart';

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
        backgroundColor: const Color(0xFF003b71),
      ),
      onPressed: onTap,
      child: Text(title),
    );
  }
}