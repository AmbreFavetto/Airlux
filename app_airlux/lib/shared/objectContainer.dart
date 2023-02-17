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
    return Row(
      children: [
        InkWell(
          onTap: onSelect,
          child: Container(
            margin: const EdgeInsets.only(
                left: 10.0, right: 10.0, top: 5.0, bottom: 5.0),
            //padding: const EdgeInsets.all(15.0),
            height: 150,
            width: 150,
            alignment: Alignment.center,
            decoration: BoxDecoration(
                color: kOrange,
                borderRadius: BorderRadius.circular(10),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, offset: Offset(0, 2))
                ]),
            child: Column(
              children: [
                const SizedBox(height: 7),
                const Icon(
                  Icons.business,
                  color: Colors.black26,
                  size: 50.0,
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: 120,
                  child: Text(
                    title,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 17.0,
                    ),
                  ),
                ),
                const SizedBox(height: 5),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit, color: Colors.black26),
                      tooltip: 'Modifier',
                      onPressed: onEdit,
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline,
                          color: Colors.black26),
                      tooltip: 'Supprimer',
                      onPressed: onDelete,
                    ),
                  ],
                ),
              ],
            ),
          ),
        )
      ],
    );
  }
}
