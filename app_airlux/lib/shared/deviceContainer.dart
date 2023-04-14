import 'package:flutter/material.dart';

import '../constants.dart';

class DeviceContainer extends StatefulWidget {
  const DeviceContainer(
      {Key? key,
      required this.onDelete,
      required this.onEdit,
      required this.title,
      required this.id,
      required this.icon})
      : super(key: key);

  final void Function() onDelete;
  final void Function() onEdit;
  final String title;
  final String id;
  final IconData icon;

  @override
  State<DeviceContainer> createState() => _DeviceContainerState();
}

class _DeviceContainerState extends State<DeviceContainer> {
  @override
  void initState() {
    super.initState();
  }

  var _isSelected = false;
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        InkWell(
          onTap: () {
            setState(() {
              _isSelected = !_isSelected;
            });
          },
          child: Container(
            margin: const EdgeInsets.only(
                left: 15.0, right: 10.0, top: 5.0, bottom: 5.0),
            padding: const EdgeInsets.all(10.0),
            height: 150,
            width: 150,
            alignment: Alignment.center,
            decoration: BoxDecoration(
                color: _isSelected == false ? kOrange : Colors.greenAccent,
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
                      widget.icon,
                      color: Colors.black26,
                      size: 50.0,
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.only(top: 3),
                    child: Text(
                      widget.title,
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
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit, color: Colors.black26),
                            tooltip: 'Modifier',
                            onPressed: widget.onEdit,
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline,
                                color: Colors.black26),
                            tooltip: 'Supprimer',
                            onPressed: widget.onDelete,
                          ),
                        ],
                      ),
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
