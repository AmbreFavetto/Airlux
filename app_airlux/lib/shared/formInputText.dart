import 'package:flutter/material.dart';

class FormInputText extends StatelessWidget {
  const FormInputText({
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