import 'package:flutter/material.dart';
import '../constants.dart';

class ActivatedDeviceContainer extends StatefulWidget {
  const ActivatedDeviceContainer(
      {Key? key,
        required this.title,
        required this.category})
      : super(key: key);

  final String title;
  final String category;

  @override
  State<ActivatedDeviceContainer> createState() => _ActivatedDeviceContainerState();
}

class _ActivatedDeviceContainerState extends State<ActivatedDeviceContainer> {

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    double mWidth = MediaQuery.of(context).size.width;

    return Row(
      children: [
        InkWell(
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
                color: Colors.greenAccent,
                borderRadius: BorderRadius.circular(10),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, offset: Offset(0, 2))
                ]),
            child: Padding(
             padding: const EdgeInsets.only(bottom: 1),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 23),
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
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
