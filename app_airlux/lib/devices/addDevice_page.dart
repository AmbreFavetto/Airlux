import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:app_airlux/devices/devices_page.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import '../../shared/formBottomButton.dart';
import '../../shared/formInputText.dart';
import '../../shared/titleFormStyle.dart';
import 'package:http/http.dart' as http;

enum Category {
  lamp,
  lamp_rgb,
  blind,
  radiator,
  air_conditioning,
  humidity,
  temperature,
  pressure
}

class AddDevicePage extends StatefulWidget {
  const AddDevicePage({super.key, required this.room_id});
  final String room_id;
  @override
  _AddDevicePageState createState() => _AddDevicePageState();
}

class _AddDevicePageState extends State<AddDevicePage> {
  final _formKey = GlobalKey<FormState>();

  TextEditingController title = TextEditingController();

  String category = '';
  Category? _category = null;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SingleChildScrollView(
          child: Column(
        children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitleFormStyle(text: "Ajouter un capteur"),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(width: 10.0, height: 20.0),
              FormInputText(
                name: title,
                inputTitle: 'Nom device',
                textType: TextInputType.text,
              ),
              SizedBox(height: 30.0),
              Row(
                children: [
                  SizedBox(width: 20.0),
                  Text(
                    'Catégorie',
                    style: TextStyle(fontSize: 22, color: Color(0xFF4F4674)),
                  )
                ],
              ),
              ListTile(
                  title: const Text('Lampe'),
                  leading: Radio<Category>(
                    value: Category.lamp,
                    groupValue: _category,
                    onChanged: (Category? value) {
                      setState(() {
                        _category = value;
                      });
                    },
                  )),
              ListTile(
                  title: const Text('Lampe RGB'),
                  leading: Radio<Category>(
                    value: Category.lamp_rgb,
                    groupValue: _category,
                    onChanged: (Category? value) {
                      setState(() {
                        _category = value;
                      });
                    },
                  )),
              ListTile(
                  title: const Text('Volet'),
                  leading: Radio<Category>(
                    value: Category.blind,
                    groupValue: _category,
                    onChanged: (Category? value) {
                      setState(() {
                        _category = value;
                      });
                    },
                  )),
              ListTile(
                  title: const Text('Radiateur'),
                  leading: Radio<Category>(
                    value: Category.radiator,
                    groupValue: _category,
                    onChanged: (Category? value) {
                      setState(() {
                        _category = value;
                      });
                    },
                  )),
              ListTile(
                  title: const Text('Climatiseur'),
                  leading: Radio<Category>(
                    value: Category.air_conditioning,
                    groupValue: _category,
                    onChanged: (Category? value) {
                      setState(() {
                        _category = value;
                      });
                    },
                  )),
              ListTile(
                  title: const Text("Capteur d'humidité"),
                  leading: Radio<Category>(
                    value: Category.humidity,
                    groupValue: _category,
                    onChanged: (Category? value) {
                      setState(() {
                        _category = value;
                      });
                    },
                  )),
              ListTile(
                  title: const Text("Température"),
                  leading: Radio<Category>(
                    value: Category.temperature,
                    groupValue: _category,
                    onChanged: (Category? value) {
                      setState(() {
                        _category = value;
                      });
                    },
                  )),
              ListTile(
                  title: const Text("Capteur de pression"),
                  leading: Radio<Category>(
                    value: Category.pressure,
                    groupValue: _category,
                    onChanged: (Category? value) {
                      setState(() {
                        _category = value;
                      });
                    },
                  )),
              Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.all(8),
                height: 100,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Consumer<DeviceData>(
                      builder: (context, deviceData, child) {
                        return FormBottomButton(
                          title: 'Sauvegarder',
                          onTap: () async {
                            if (title.text.isNotEmpty && (_category != null)) {
                              if (_category!.name == 'lamp_rgb')
                                category = 'lamp rgb';
                              else
                                category = _category!.name;
                              http.Response response =
                                  await deviceData.addDevice(
                                      title.text, category, widget.room_id);
                              print(response.body);
                              if (response.statusCode == 201) {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          DevicesPage(roomId: widget.room_id)),
                                );
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content:
                                        Text('Ajout de capteur impossible.'),
                                  ),
                                );
                              }
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Formulaire invalide.'),
                                ),
                              );
                            }
                          },
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      )),
    );
  }
}
