import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:syncfusion_flutter_sliders/sliders.dart';

import '../constants.dart';

class DeviceContainer extends StatelessWidget {
  const DeviceContainer(
      {Key? key,
      required this.onDelete,
      required this.onSelect,
      required this.title,
      required this.id,
      required this.category,
      required this.icon})
      : super(key: key);

  final void Function() onDelete;
  final void Function() onSelect;
  final String title;
  final String id;
  final String category;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        InkWell(
          onTap: onSelect,
          child: Container(
              margin: const EdgeInsets.only(
                  left: 15.0, right: 10.0, top: 5.0, bottom: 5.0),
              padding: const EdgeInsets.all(10.0),
              height: 150,
              width: 150,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                  color: kOrange,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: const [
                    BoxShadow(color: Colors.black26, offset: Offset(0, 2))
                  ]),
              child: Padding(
                padding: EdgeInsets.only(bottom: 1),
                child: Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.only(top: 8),
                      child: Icon(
                        icon,
                        color: Colors.black26,
                        size: 50.0,
                      ),
                    ),
                    Padding(
                      padding: EdgeInsets.only(top: 3),
                      child: Text(
                        title,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15.0,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(top: 2.0),
                        child: IconButton(
                          icon: const Icon(Icons.delete_outline,
                              color: Colors.black26),
                          tooltip: 'Supprimer',
                          onPressed: onDelete,
                        ),
                      ),
                    )
                  ],
                ),
              )),
        )
      ],
    );
  }
}
