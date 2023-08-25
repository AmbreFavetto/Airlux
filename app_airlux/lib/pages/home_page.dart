import 'package:app_airlux/constants.dart';
import 'package:app_airlux/shared/activatedDeviceContainer.dart';
import 'package:flutter/material.dart';
import 'package:app_airlux/shared/deviceContainer.dart';
import 'package:app_airlux/models/devices/device.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import 'package:provider/provider.dart';
import '../widget/appBarBuilder.dart';
import 'package:http/http.dart' as http;

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  TextEditingController _editDeviceNameController = TextEditingController();
  @override
  void initState() {
    super.initState();
    Provider.of<DeviceData>(context, listen: false).getDevicesByState("on");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const AppBarBuilder(),
          const Text(
            'Bienvenue, voici tous les appareils activés :',
            style: TextStyle(fontSize: 17.0),
          ),
          Expanded(
            child: Consumer<DeviceData>(
              builder: (context, deviceData, child) => GridView.builder(
                shrinkWrap: true,
                padding: const EdgeInsets.all(20),
                itemCount: deviceData.devices.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                ),
                itemBuilder: (context, index) {
                  final device = deviceData.devices[index];
                  return ActivatedDeviceContainer(
                      title: device.name.toString(),
                      category: device.category.toString());
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  _editDevice(
      BuildContext context, Device device, DeviceData deviceData) async {
    setState(() {
      _editDeviceNameController.text = device.name ?? 'No name';
    });
    _editFormDialog(context, device, deviceData);
  }

  _editFormDialog(BuildContext context, Device device, DeviceData deviceData) {
    return showDialog(
      context: context,
      barrierDismissible: true,
      builder: (param) {
        return AlertDialog(
            actions: <Widget>[
              TextButton(
                onPressed: () async {
                  print(_editDeviceNameController.text);
                  http.Response response = await deviceData.updateDevice(
                      _editDeviceNameController.text, device);
                  if (response.statusCode == 200) {
                    Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => HomePage()));
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('La mise à jour n\'a pas pu aboutir.'),
                      ),
                    );
                  }
                },
                child: const Text(
                  'Mettre à jour',
                  style: TextStyle(color: kDarkPurple),
                ),
              ),
            ],
            title: const Text('Modifier un capteur'),
            content: SingleChildScrollView(
                child: Column(children: <Widget>[
              TextField(
                controller: _editDeviceNameController,
                decoration: const InputDecoration(
                    hintText: 'Nom', labelText: 'Nom du capteur'),
              )
            ])));
      },
    );
  }
}
