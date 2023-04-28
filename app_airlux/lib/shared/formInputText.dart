import 'package:app_airlux/constants.dart';
import 'package:flutter/material.dart';

class FormInputText extends StatelessWidget {
  const FormInputText(
      {Key? key,
      required this.name,
      required this.inputTitle,
      required this.textType,
      this.icon})
      : super(key: key);

  final TextEditingController name;
  final String inputTitle;
  final TextInputType textType;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: const EdgeInsets.symmetric(horizontal: 20),
        padding: icon != null
            ? const EdgeInsets.symmetric(horizontal: 5)
            : const EdgeInsets.symmetric(horizontal: 15),
        alignment: Alignment.center,
        decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            boxShadow: const [
              BoxShadow(color: Colors.black26, offset: Offset(0, 2))
            ]),
        child: TextField(
            cursorColor: kDarkPurple,
            controller: name,
            keyboardType: textType,
            style: const TextStyle(color: Colors.black87),
            decoration: InputDecoration(
                border: InputBorder.none,
                labelText: inputTitle,
                hintStyle: const TextStyle(color: Colors.black38),
                prefixIcon: icon != null
                    ? Icon(
                        icon,
                        color: Colors.black,
                      )
                    : null)));
  }
}
