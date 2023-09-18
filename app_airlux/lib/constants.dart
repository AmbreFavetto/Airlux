import 'package:flutter/material.dart';
late var token;
//var prefixUrl = 'http://192.168.1.96';
//var prefixUrl = 'http://10.0.2.2';
late String userId;

late String currentBuildingId;
late String currentBuildingName;
late String currentFloorId;
late String currentFloorName;
late String currentRoomId;
late String currentRoomName;

Map<String, String> headerLessToken (String sync){
  Map<String, String> requestHeader = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (sync == "1"){
    requestHeader = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'sync': '1',
    };
  }
  return requestHeader;
}

Map<String, String> header (String sync){
  Map<String, String> requestHeader = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token,
  };
  if (sync == "1"){
    print ("1234567890");
    requestHeader = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
      'sync': '1',
    };
  }
  print ("test"+ requestHeader.toString());
  return requestHeader;
}


const kLightRed = Color(0xFFFD919E);
const kDarkRed = Color(0xFFE8647C);
const kDarkPurple = Color(0xFF4F4674);
const kLightBlue = Color(0xFFDFE6FE);
const kOrange = Color(0xFFF3C38C);

const kLamp = 'lamp';
const kLampRgb = 'lamp_rgb';
const kBlind = 'blind';
const kRadiator = 'radiator';
const kAirConditioning = 'air_conditioning';
const kHumidity = 'humidity';
const kTemperature = 'temperature';
const kPressure = 'pressure';