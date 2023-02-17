import 'package:flutter/material.dart';

import '../constants.dart';

class TitleFormStyle extends StatelessWidget {
  const TitleFormStyle({
    Key? key,
    required this.text,
  }) : super(key: key);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const SizedBox(width: 10),
        const BackButton(),
        const SizedBox(width: 20),
        SizedBox(
            width: 250,
            child: Text(
              text,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: kDarkPurple,
                fontSize: 30.0,
                fontWeight: FontWeight.bold,
                fontFamily: 'Abel',
              ),
            )),
      ],
    );
  }
}
