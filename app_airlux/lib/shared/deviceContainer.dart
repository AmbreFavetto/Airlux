import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:syncfusion_flutter_sliders/sliders.dart';

import '../constants.dart';

class DeviceContainer extends StatefulWidget {
  const DeviceContainer(
      {Key? key,
      required this.onDelete,
      required this.onEdit,
      required this.onTap,
      required this.title,
      required this.id,
      required this.category,
      required this.value})
      : super(key: key);

  final void Function() onDelete;
  final void Function() onEdit;
  final void Function(bool value) onTap;
  final String title;
  final String id;
  final String category;
  final bool value;

  @override
  State<DeviceContainer> createState() => _DeviceContainerState();
}

class _DeviceContainerState extends State<DeviceContainer> {
  var _isActive;

  @override
  void initState() {
    super.initState();
    _isActive = widget.value;
  }

  double _lampIntensity = 20;
  double _lampRgbIntensity = 20;
  double _radiatorValue = 18;

  Color _lampRgbPickerColor = const Color(0xffffffff);

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
                            LampIntensitySlider(currentValue: _lampIntensity),
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
                            const Text('Intensité'),
                            LampIntensitySlider(currentValue: _lampRgbIntensity),
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
                            const Text('Température'),
                            RadiatorSlider(currentValue: _radiatorValue),
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
              case kHumidity:
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
                            const TitleModalBottom(text: 'Humidité'),
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
              case kTemperature:
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
                            const TitleModalBottom(text: 'Temperature'),
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
              case kPressure:
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
                            const TitleModalBottom(text: 'Pression'),
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
              _isActive = !_isActive;
              widget.onTap(_isActive);
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
                color: _isActive == false ? kOrange : Colors.greenAccent,
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
                                        : widget.category == kHumidity
                                            ? const Icon(
                                                Icons.water_drop,
                                                color: Colors.black26,
                                                size: 50.0,
                                              )
                                            : widget.category == kTemperature
                                                ? const Icon(
                                                    Icons.device_thermostat,
                                                    color: Colors.black26,
                                                    size: 50.0,
                                                  )
                                                : widget.category == kPressure
                                                    ? const Icon(
                                                        Icons.tire_repair,
                                                        color: Colors.black26,
                                                        size: 50.0,
                                                      )
                                                    : const Icon(
                                                        Icons
                                                            .dangerous_outlined,
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
    Key? key,
    required this.text,
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

class LampIntensitySlider extends StatelessWidget {
  LampIntensitySlider({
    Key? key,
    required this.currentValue,
}) : super (key: key);

  double currentValue;
  final List<double> sliderValues = [0.5, 20.0, 40.0, 60.0, 80.0, 100.0];

  @override
  Widget build(BuildContext context){
    return StatefulBuilder(
      builder: (context, state) => Center(
        child: SliderTheme(
          data: SliderTheme.of(context).copyWith(
            inactiveTrackColor: const Color(0xFF8D8E98),
            activeTrackColor: kDarkPurple,
            thumbColor: kLightRed,
            overlayColor: kDarkRed,
            thumbShape: const RoundSliderThumbShape(
                enabledThumbRadius: 13.0),
            overlayShape: const RoundSliderOverlayShape(
                overlayRadius: 20.0),
          ),
          child: Slider(
            value: currentValue,
            min: 0.0,
            max: 100.0,
            divisions: sliderValues.length - 1,
            label: currentValue.toString(),
            onChanged: (value) {
              state(() {
                currentValue = value;
              });
            },
          ),
        ),
      ),
    );
  }
}

class RadiatorSlider extends StatelessWidget {
  RadiatorSlider({
    Key? key,
    required this.currentValue,
  }) : super (key: key);

  double currentValue;
  final List<double> sliderValues = [0.0, 6.0, 12.0, 15.0, 17.0, 18.0, 20.0, 22.0];

  @override
  Widget build(BuildContext context){
    return StatefulBuilder(
      builder: (context, state) => Center(
        child: SliderTheme(
          data: SliderTheme.of(context).copyWith(
            inactiveTrackColor: Colors.red,
            activeTrackColor: Colors.blue,
            thumbColor: Colors.grey,
            overlayColor: Colors.grey,
            thumbShape: const RoundSliderThumbShape(
                enabledThumbRadius: 13.0),
            overlayShape: const RoundSliderOverlayShape(
                overlayRadius: 20.0),
          ),
          child: Slider(
            value: currentValue,
            min: 0.0,
            max: 22.0,
            divisions: sliderValues.length - 1,
            label: currentValue.toString(),
            onChanged: (value) {
              state(() {
                currentValue = value;
              });
            },
          ),
        ),
      ),
    );
  }
}