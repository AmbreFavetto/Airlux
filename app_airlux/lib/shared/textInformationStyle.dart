import 'package:flutter/material.dart';

import '../constants.dart';

class TextInformationStyle extends StatelessWidget {
  const TextInformationStyle({
    Key? key,
    required this.text,
  }) : super(key: key);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const SizedBox(width: 20),
        SizedBox(
            child: Text(
              text,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: kDarkPurple,
                fontSize: 20.0,
                fontFamily: 'Abel',
              ),
            )),
      ],
    );
  }
}
