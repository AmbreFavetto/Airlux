import 'package:app_airlux/shared/formBottomButton.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Form bottom button text test.', (tester) async {
    await tester.pumpWidget(
      Material(
        child: new MediaQuery(
          data: new MediaQueryData(),
          child: new MaterialApp(
              home: FormBottomButton(
            title: 'Boutton',
            onTap: () {
              print("Test ok");
            },
          )),
        ),
      ),
    );

    final textFinder = find.text('Boutton');

    expect(textFinder, findsOneWidget);
  });
}
