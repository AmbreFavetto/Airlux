import 'package:app_airlux/models/devices/device_data.dart';
import 'package:app_airlux/shared/deviceContainer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/textInformationStyle.dart';
import '../shared/titlePageStyle.dart';

class DevicesPage extends StatelessWidget {
  const DevicesPage({super.key, required this.id, required this.name});
  final String id;
  final String name;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(width: 10.0, height: 20.0),
          const TitlePageStyle(text: "Devices"),
          const SizedBox(height: 15),
          TextInformationStyle(text: 'Nom de la salle : $name'),
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
                  deviceData.getDevicesByRoomId(id);
                  return DeviceContainer(
                    icon: Icons.tungsten,
                    onDelete: () => deviceData.deleteDevice(device),
                    onEdit: () => {},
                    title: device.name.toString(),
                    id: device.id.toString(),
                  );
                },
              ),
            ),
          )
        ],
      ),
    );
  }
}
