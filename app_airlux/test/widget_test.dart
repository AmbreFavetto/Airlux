import 'package:app_airlux/shared/formBottomButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Form bottom button text test.', (tester) async {
    await tester.pumpWidget(
      Material(
        child: MediaQuery(
          data: const MediaQueryData(),
          child: MaterialApp(
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

  testWidgets('Object container text test.', (tester) async {
    await tester.pumpWidget(
      Material(
        child: MediaQuery(
          data: const MediaQueryData(),
          child: MaterialApp(
              home: ObjectContainer(
            title: 'Object container',
            id: '1',
            icon: Icons.arrow_back,
            onDelete: () {
              print("Delete ok");
            },
            onEdit: () {
              print("Edit ok");
            },
            onSelect: () {
              print("Select ok");
            },
          )),
        ),
      ),
    );

    final textFinder = find.text('Object container');

    expect(textFinder, findsOneWidget);
  });
}
