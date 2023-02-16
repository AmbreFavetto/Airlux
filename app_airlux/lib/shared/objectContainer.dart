import 'package:flutter/material.dart';

import '../constants.dart';

class ObjectContainer extends StatelessWidget {
  const ObjectContainer(
      {Key? key,
      required this.onDelete,
      required this.onEdit,
      required this.onSelect,
      required this.title,
      this.id})
      : super(key: key);

  final void Function() onDelete;
  final void Function() onEdit;
  final void Function() onSelect;
  final String title;
  final int? id;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: onSelect,
          child: Container(
            margin: const EdgeInsets.only(
                left: 10.0, right: 10.0, top: 5.0, bottom: 5.0),
            alignment: Alignment.center,
            decoration: BoxDecoration(
                color: kOrange,
                borderRadius: BorderRadius.circular(10),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, offset: Offset(0, 2))
                ]),
            height: 60,
            child: Row(
              children: [
                const SizedBox(width: 15),
                SizedBox(
                    width: 250,
                    child: Text(
                      title,
                      textAlign: TextAlign.left,
                      style: const TextStyle(color: Colors.white),
                    )),
                IconButton(
                  icon: const Icon(Icons.edit, color: Colors.white),
                  tooltip: 'Modifier',
                  onPressed: onEdit,
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.white),
                  tooltip: 'Supprimer',
                  onPressed: onDelete,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
