import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';

import '../constants.dart';

class DeviceContainer extends StatefulWidget {
  const DeviceContainer(
      {Key? key,
      required this.onDelete,
      required this.onEdit,
      required this.title,
      required this.id,
      required this.category})
      : super(key: key);

  final void Function() onDelete;
  final void Function() onEdit;
  final String title;
  final String id;
  final String category;

  @override
  State<DeviceContainer> createState() => _DeviceContainerState();
}

class _DeviceContainerState extends State<DeviceContainer> {
  @override
  void initState() {
    super.initState();
  }

  var _isSelected = false;
  var _isActive = false;

  var _lampIntensity = 50.0;
  Color _lampRgbPickerColor = const Color(0xffffffff);
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        InkWell(
          onLongPress: () {
            switch (widget.category) {
              case kLamp:
                showModalBottomSheet(
                  context: context,
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadiusDirectional.only(
                      topEnd: Radius.circular(25),
                      topStart: Radius.circular(25),
                    ),
                  ),
                  builder: (BuildContext context) {
                    return SingleChildScrollView(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            const Text('Lampe'),
                            const Text('On/Off'),
                            Switch(
                              value: _isActive,
                              activeColor: kOrange,
                              onChanged: (bool value) {
                                setState(() {
                                  _isActive = value;
                                });
                              },
                            ),
                            const Text('Intensité'),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.baseline,
                              textBaseline: TextBaseline.alphabetic,
                              children: [
                                Text(
                                  _lampIntensity.toInt().toString(),
                                ),
                                const Text(
                                  '%',
                                ),
                              ],
                            ),
                            SliderTheme(
                              data: SliderTheme.of(context).copyWith(
                                inactiveTrackColor: const Color(0xFF8D8E98),
                                activeTrackColor: Colors.white,
                                thumbColor: kLightRed,
                                overlayColor: kDarkRed,
                                thumbShape: const RoundSliderThumbShape(
                                    enabledThumbRadius: 15.0),
                                overlayShape: const RoundSliderOverlayShape(
                                    overlayRadius: 30.0),
                              ),
                              child: Slider(
                                value: _lampIntensity,
                                min: 0.0,
                                max: 100.0,
                                onChanged: (value) {
                                  setState(() {
                                    _lampIntensity = value;
                                  });
                                },
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.expand_more,
                                  color: Colors.black26),
                              tooltip: 'Quitter',
                              onPressed: () => Navigator.pop(context),
                              iconSize: 45.0,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
                break;
              case kLampRgb:
                showModalBottomSheet(
                  context: context,
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadiusDirectional.only(
                      topEnd: Radius.circular(25),
                      topStart: Radius.circular(25),
                    ),
                  ),
                  builder: (BuildContext context) {
                    return SingleChildScrollView(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            const Text('Lampe RGB'),
                            Switch(
                              value: _isActive,
                              activeColor: kOrange,
                              onChanged: (bool value) {
                                setState(() {
                                  _isActive = value;
                                });
                              },
                            ),
                            ColorPicker(
                              enableAlpha: false,
                              labelTypes: [],
                              pickerColor: _lampRgbPickerColor,
                              onColorChanged: (Color color) {
                                setState(() {
                                  _lampRgbPickerColor = color;
                                });
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.expand_more,
                                  color: Colors.black26),
                              tooltip: 'Quitter',
                              onPressed: () => Navigator.pop(context),
                              iconSize: 45.0,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
                break;
              case kBlind:
                showModalBottomSheet(
                  context: context,
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadiusDirectional.only(
                      topEnd: Radius.circular(25),
                      topStart: Radius.circular(25),
                    ),
                  ),
                  builder: (BuildContext context) {
                    return SingleChildScrollView(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            const Text('Volets'),
                            Switch(
                              value: _isActive,
                              activeColor: kOrange,
                              onChanged: (bool value) {
                                setState(() {
                                  _isActive = value;
                                });
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.expand_more,
                                  color: Colors.black26),
                              tooltip: 'Quitter',
                              onPressed: () => Navigator.pop(context),
                              iconSize: 45.0,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
                break;
              case kRadiator:
                showModalBottomSheet(
                  context: context,
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadiusDirectional.only(
                      topEnd: Radius.circular(25),
                      topStart: Radius.circular(25),
                    ),
                  ),
                  builder: (BuildContext context) {
                    return SingleChildScrollView(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            const Text('Radiateur'),
                            Switch(
                              value: _isActive,
                              activeColor: kOrange,
                              onChanged: (bool value) {
                                setState(() {
                                  _isActive = value;
                                });
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.expand_more,
                                  color: Colors.black26),
                              tooltip: 'Quitter',
                              onPressed: () => Navigator.pop(context),
                              iconSize: 45.0,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
                break;
              case kAirConditioning:
                showModalBottomSheet(
                  context: context,
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadiusDirectional.only(
                      topEnd: Radius.circular(25),
                      topStart: Radius.circular(25),
                    ),
                  ),
                  builder: (BuildContext context) {
                    return SingleChildScrollView(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            const Text('Climatiseur'),
                            Switch(
                              value: _isActive,
                              activeColor: kOrange,
                              onChanged: (bool value) {
                                setState(() {
                                  _isActive = value;
                                });
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.expand_more,
                                  color: Colors.black26),
                              tooltip: 'Quitter',
                              onPressed: () => Navigator.pop(context),
                              iconSize: 45.0,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
                break;
              default:
                break;
            }
          },
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
              padding: const EdgeInsets.only(bottom: 1),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: widget.category == kLamp
                        ? const Icon(
                            Icons.light,
                            color: Colors.black26,
                            size: 50.0,
                          )
                        : widget.category == kLampRgb
                            ? const Icon(
                                Icons.tungsten,
                                color: Colors.black26,
                                size: 50.0,
                              )
                            : widget.category == kBlind
                                ? const Icon(
                                    Icons.blinds,
                                    color: Colors.black26,
                                    size: 50.0,
                                  )
                                : widget.category == kRadiator
                                    ? const Icon(
                                        Icons.thermostat,
                                        color: Colors.black26,
                                        size: 50.0,
                                      )
                                    : widget.category == kAirConditioning
                                        ? const Icon(
                                            Icons.heat_pump,
                                            color: Colors.black26,
                                            size: 50.0,
                                          )
                                        : const Icon(
                                            Icons.dangerous_outlined,
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
