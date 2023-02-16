#include <Arduino.h>
#include <WiFi.h>

#include "wifi.h"

String Wifi::ssid = "";
String Wifi::pwd = "";

bool Wifi::_is_connected = false;

void Wifi::connect()
{
  WiFi.begin(ssid.c_str(), pwd.c_str());
}

bool Wifi::is_connected()
{
  _is_connected = (WiFi.status() == WL_CONNECTED);
  return _is_connected;
}
