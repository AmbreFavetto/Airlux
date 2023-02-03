import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/shared/addButton.dart';
import 'package:app_airlux/shared/objectContainer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants.dart';

class DevicesPage extends StatelessWidget {
  const DevicesPage({super.key, required this.id, required this.name});
  final int? id;
  final String? name;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: kFonceyBlue,
        title: const Text('Devices'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 15),
          Text('Salle : $name',
              style: const TextStyle(color: Color(0xFF003b71))),
          const SizedBox(height: 15),
          Expanded(
            child: Consumer<DeviceData>(
              builder: (context, deviceData, child) => ListView.builder(
                itemBuilder: (context, index) {
                  final device = deviceData.devices[index];
                  deviceData.getDevicesByRoomId(id);
                  return ObjectContainer(
                    onDelete: () => deviceData.deleteDevice(device),
                    onEdit: () => {},
                    onSelect: () {

                    },
                    title: device.name.toString(),
                    id: device.id?.toInt(),
                  );
                },
                itemCount: deviceData.devices.length,
              ),
            ),
          )
        ],
      ),
      floatingActionButton: AddButton(
          onTap: () {
            Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const BuildingsPage(),
                ));
          },
          title: 'Ajouter un device'),
    );
  }
}
