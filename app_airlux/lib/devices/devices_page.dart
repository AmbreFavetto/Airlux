import 'package:app_airlux/devices/addDevice_page.dart';
import 'package:app_airlux/models/devices/device.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/shared/deviceContainer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants.dart';
import '../shared/addButton.dart';
import '../shared/objectContainer.dart';
import '../shared/textInformationStyle.dart';
import '../shared/titlePageStyle.dart';
import 'package:http/http.dart' as http;

class DevicesPage extends StatefulWidget {
  const DevicesPage({super.key, required this.roomId, required this.roomName});
  final String roomId;
  final String roomName;
  @override
  _DevicesPageState createState() => _DevicesPageState();
}

class _DevicesPageState extends State<DevicesPage> {

  TextEditingController _editDeviceNameController = TextEditingController();
  @override
  void initState() {
    super.initState();
    Provider.of<DeviceData>(context, listen: false).getDevicesByRoomId(widget.roomId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitlePageStyle(text: "Devices"),
          const SizedBox(height: 15),
          //TODO
          TextInformationStyle(text: 'Nom de la salle : ${widget.roomName}'),
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
                  return DeviceContainer(
                    onDelete: () async => {
                      if ((await deviceData.deleteDevice(
                          device)).statusCode == 200) {
                        Navigator.of(context).push(MaterialPageRoute(
                            builder: (context) => DevicesPage(
                              roomId: widget.roomId,roomName: widget.roomName
                            )))
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('La supression de du capteur n\'a pu aboutir.'),
                          ),
                        )
                      }},
                    onEdit: () => _editDevice(context, device, deviceData),
                    title: device.name.toString(),
                    id: device.id.toString(),
                    category: device.category.toString(),
                  );
                },
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => AddDevicePage(room_id: widget.roomId),
            ));
          },
          title: 'Ajouter un batiment'),
    );
  }
  _editDevice(BuildContext context, Device device,
      DeviceData deviceData) async {
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
                  http.Response response = await deviceData
                      .updateDevice(_editDeviceNameController.text, device);
                  if (response.statusCode == 200) {
                    Navigator.of(context).push(
                        MaterialPageRoute(
                            builder: (context) =>
                            DevicesPage(roomId: widget.roomId,roomName:widget.roomName,)));
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
