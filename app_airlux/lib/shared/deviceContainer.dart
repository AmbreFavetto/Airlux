import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:thermostat/thermostat.dart';

import '../constants.dart';

typedef void StringCallback(String newValue);

class DeviceContainer extends StatefulWidget {
  const DeviceContainer(
      {Key? key,
        required this.onDelete,
        required this.onEdit,
        required this.onTap,
        required this.title,
        required this.id,
        required this.category,
        required this.result,
        required this.newValue})
      : super(key: key);

  final void Function() onDelete;
  final void Function() onEdit;
  final void Function(bool value) onTap;
  final String title;
  final String id;
  final String category;
  final String result;
  final StringCallback newValue;

  @override
  State<DeviceContainer> createState() => _DeviceContainerState();
}

class _DeviceContainerState extends State<DeviceContainer> {
  var _isActive;
  var resultSplitted;
  var _lampIntensity;
  var _lampRgbIntensity;
  var _currentColor;

  @override
  void initState() {
    super.initState();

    resultSplitted = widget.result.split(',');

    if (int.parse(resultSplitted[0]) == 1) {
      _isActive = true;
    } else {
      _isActive = false;
    }

    if (widget.category == kLamp) {
      _lampIntensity = double.parse(resultSplitted[1]);
    } else {
      _lampIntensity = 20;
    }

    if (widget.category == kLampRgb) {
      _lampRgbIntensity = double.parse(resultSplitted[1]);
    } else {
      _lampRgbIntensity = 20;
    }

    if (widget.category == kLampRgb) {
      _currentColor = Color.fromRGBO(int.parse(resultSplitted[2]),
          int.parse(resultSplitted[3]), int.parse(resultSplitted[4]), 1);
    } else {
      _currentColor = Colors.white;
    }
  }

  List<Color> colors = [
    Colors.white,
    //Colors.red,
    Color.fromRGBO(244, 67, 54, 1),
    //Colors.pink,
    Color.fromRGBO(233, 30, 99, 1),
    // Colors.purple,
    Color.fromRGBO(156, 39, 176, 1),
    //Colors.blue,
    Color.fromRGBO(33, 150, 243, 1),
    //Colors.green,
    Color.fromRGBO(76, 175, 80, 1),
    //Colors.amber,
    Color.fromRGBO(255, 193, 7, 1),
    // Colors.orange,
    Color.fromRGBO(255, 152, 0, 1),
    //Colors.grey
    Color.fromRGBO(158, 158, 158, 1),
  ];

  @override
  Widget build(BuildContext context) {
    double mWidth = MediaQuery.of(context).size.width;

    return Row(
      children: [
        InkWell(
          onLongPress: () {
            if (_isActive) {
              switch (widget.category) {
                case kLamp:
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
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
                              const Text('Intensité'),
                              LampIntensitySlider(
                                currentValue: _lampIntensity,
                                onIntensityChanged: (double newIntensity) {
                                  setState(() {
                                    _lampIntensity = newIntensity;
                                    widget.newValue(
                                        '1,${_lampIntensity.toInt()}');

                                    // si intensité à 0 alors on éteint
                                    if (newIntensity == 0) {
                                      _isActive = false;
                                      widget.newValue('0,0');
                                    } else if (newIntensity > 0 && !_isActive) {
                                      // sinon on allume
                                      _isActive = true;
                                      widget.newValue('1,$newIntensity');
                                    }
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
                case kLampRgb:
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
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
                              const Text('Intensité'),
                              LampIntensitySlider(
                                currentValue: _lampRgbIntensity,
                                onIntensityChanged: (double newIntensity) {
                                  setState(() {
                                    _lampRgbIntensity = newIntensity;
                                    int intColor = int.parse('0x' +
                                        _currentColor.value.toRadixString(16));
                                    int red = (intColor >> 16) & 0xff;
                                    int green = (intColor >> 8) & 0xff;
                                    int blue = (intColor >> 0) & 0xff;
                                    widget.newValue(
                                        '1,${_lampRgbIntensity.toInt()},${red},${green},${blue}');

                                    // if on slide intensity jusqu'à 0 alors ça éteint tout
                                    if (newIntensity == 0) {
                                      _isActive = false;
                                      _currentColor = Colors.white;
                                      widget.newValue('0,0,0,0,0');
                                    } else if (newIntensity > 0 && !_isActive) {
                                      // if le on/off est à éteint et qu'on bouge l'intensité alors ça allume tout
                                      _isActive = true;
                                      _currentColor =
                                          Color.fromRGBO(244, 67, 54, 1);
                                      widget.newValue(
                                          '1,${newIntensity},244,67,54');
                                    }
                                  });
                                },
                              ),
                              BlockPicker(
                                availableColors: colors,
                                pickerColor: _currentColor,
                                onColorChanged: (Color color) {
                                  setState(() {
                                    _currentColor = color;
                                    int intColor = int.parse('0x' +
                                        _currentColor.value.toRadixString(16));
                                    int red = (intColor >> 16) & 0xff;
                                    int green = (intColor >> 8) & 0xff;
                                    int blue = (intColor >> 0) & 0xff;
                                    widget.newValue(
                                        '1,${_lampRgbIntensity.toInt()},${red},${green},${blue}');
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
                    isScrollControlled: true,
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
                              const Text('Température'),
                              const Thermostat(
                                minVal: 15,
                                maxVal: 25,
                                curVal: 0,
                                // valeur courante, à remplacer par la valeur qu'on recoit
                                setPoint: 18.0,
                                setPointMode: SetPointMode.displayAndEdit,
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
                    isScrollControlled: true,
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
                              const Text('Température'),
                              const Thermostat(
                                minVal: 10,
                                maxVal: 30,
                                curVal: 0,
                                // valeur courante, à remplacer par la valeur qu'on recoit
                                setPoint: 18.0,
                                setPointMode: SetPointMode.displayAndEdit,
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
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Veuillez d'abord activer votre device."),
                ),
              );
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

typedef void IntensityCallback(double intensity);

class LampIntensitySlider extends StatelessWidget {
  LampIntensitySlider({
    Key? key,
    required this.currentValue,
    required this.onIntensityChanged,
  }) : super(key: key);

  double currentValue;
  final List<double> sliderValues = [0.5, 20.0, 40.0, 60.0, 80.0, 100.0];
  final IntensityCallback onIntensityChanged;

  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(
      builder: (context, state) => Center(
        child: SliderTheme(
          data: SliderTheme.of(context).copyWith(
            inactiveTrackColor: const Color(0xFF8D8E98),
            activeTrackColor: kDarkPurple,
            thumbColor: kLightRed,
            overlayColor: kDarkRed,
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 13.0),
            overlayShape: const RoundSliderOverlayShape(overlayRadius: 20.0),
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
              onIntensityChanged(currentValue);
            },
          ),
        ),
      ),
    );
  }
}
