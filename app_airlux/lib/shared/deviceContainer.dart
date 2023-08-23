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
import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:syncfusion_flutter_sliders/sliders.dart';

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
  double _currentSliderValue = 20;

  @override
  Widget build(BuildContext context) {
    double mWidth = MediaQuery.of(context).size.width;

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
                            const TitleModalBottom(text: 'Lampe'),
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
                            Slider(
                              value: _currentSliderValue,
                              max: 100,
                              divisions: 5,
                              label: _currentSliderValue.round().toString(),
                              onChanged: (double value) {
                                setState(() {
                                  _currentSliderValue = value;
                                });
                              },
                            ),
                            SfSlider(
                              min: 0.0,
                              max: 100.0,
                              value: _currentSliderValue,
                              interval: 20,
                              showTicks: true,
                              showLabels: true,
                              enableTooltip: true,
                              minorTicksPerInterval: 1,
                              onChanged: (dynamic value){
                                setState(() {
                                  _currentSliderValue = value;
                                });
                              },
                            ),
                            // GestureDetector(
                            //   child: Container(
                            //     child: SliderTheme(
                            //       data: SliderTheme.of(context).copyWith(
                            //         inactiveTrackColor: const Color(0xFF8D8E98),
                            //         activeTrackColor: const Color(0xFF8D8E98),
                            //         thumbColor: kLightRed,
                            //         overlayColor: kDarkRed,
                            //         thumbShape: const RoundSliderThumbShape(
                            //             enabledThumbRadius: 15.0),
                            //         overlayShape: const RoundSliderOverlayShape(
                            //             overlayRadius: 30.0),
                            //       ),
                            //       child: Slider(
                            //         value: _lampIntensity,
                            //         min: 0.0,
                            //         max: 100.0,
                            //         onChanged: (value) {
                            //           setState(() {
                            //             _lampIntensity = value;
                            //           });
                            //         },
                            //       ),
                            //     ),
                            //   )
                            // ),
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
                            const TitleModalBottom(text: 'Lampe RGB'),
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
                            const TitleModalBottom(text: 'Volets'),
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
                            const TitleModalBottom(text: 'Radiateur'),
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
                            const TitleModalBottom(text: 'Climatiseur'),
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
            margin: EdgeInsets.only(
              left: (mWidth * 0.02),
              right: (mWidth * 0.01),
              top: 5.0,
              bottom: 5.0,
            ),
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
                    padding: const EdgeInsets.only(top: 3),
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
                      padding: const EdgeInsets.only(top: 2.0),
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

class TitleModalBottom extends StatelessWidget {
  const TitleModalBottom({
    Key? key, required this.text,
  }) : super(key: key);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(15.0),
      child: Text(
        text,
        style: const TextStyle(color: kDarkPurple, fontSize: 25.0),
      ),
    );
  }
}

