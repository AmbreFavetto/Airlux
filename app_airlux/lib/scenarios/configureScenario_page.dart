import 'package:app_airlux/scenarios/scenarios_page.dart';
import 'package:app_airlux/shared/formInputText.dart';
import 'package:app_airlux/shared/titleFormStyle.dart';
import 'package:flutter/material.dart';
import '../shared/formBottomButton.dart';

class ConfigureScenarioPage extends StatefulWidget {
  const ConfigureScenarioPage({super.key});
  @override
  ConfigureScenarioPageState createState() => ConfigureScenarioPageState();
}

class ConfigureScenarioPageState extends State<ConfigureScenarioPage> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController title = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      //TODO
    );
  }
}
