// import 'package:flutter/material.dart';
// import 'package:app_airlux/constants.dart';
//
// class SettingPage extends StatelessWidget {
//   const SettingPage({super.key});
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: SingleChildScrollView(
//         child: Container(
//           padding: const EdgeInsets.all(10.0),
//           child: Column(children: [
//             SizedBox(height: 20),
//             ElevatedButton(
//               onPressed: () {
//                 Navigator.of(context).pushNamed('/login');
//               },
//               style: ElevatedButton.styleFrom(
//                 shape: const StadiumBorder(),
//                 padding: const EdgeInsets.all(13),
//                 backgroundColor: kOrange,
//               ),
//               child: Row(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: const [
//                   SizedBox(width: 10),
//                   Text(
//                     'BLUETOOTH',
//                     style: TextStyle(
//                       color: kDarkPurple,
//                       fontWeight: FontWeight.w800,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//             SizedBox(height: 20),
//             ElevatedButton(
//               onPressed: () {
//                 Navigator.of(context).pushNamed('/cgu');
//               },
//               style: ElevatedButton.styleFrom(
//                 shape: const StadiumBorder(),
//                 padding: const EdgeInsets.all(13),
//                 backgroundColor: kOrange,
//               ),
//               child: Row(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: const [
//                   SizedBox(width: 10),
//                   Text(
//                     'CGU',
//                     style: TextStyle(
//                       color: kDarkPurple,
//                       fontWeight: FontWeight.w800,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ]),
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_sliders/sliders.dart';

class SettingPage extends StatefulWidget {
  const SettingPage({super.key});

  @override
  State<SettingPage> createState() => _SettingPageState();
}

class _SettingPageState extends State<SettingPage> {
  double _currentSliderValue = 20;

  @override
  Widget build(BuildContext context) {
    return SfSlider(
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
    );
  }
}
