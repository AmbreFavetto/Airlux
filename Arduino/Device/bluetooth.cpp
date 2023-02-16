#include "BluetoothSerial.h"

#include "bluetooth.h"
#include "wifi.h"

BluetoothSerial serialBT;

bool Bluetooth::_is_init = false;

bool Bluetooth::is_init()
{
  return _is_init;
}

bool Bluetooth::is_available()
{
  return serialBT.available();
}

void Bluetooth::start()
{
  if (_is_init == false)
  {
    serialBT.begin("Airlux_test");
    _is_init = true;
  }
}

void Bluetooth::stop()
{
  if (_is_init)
  {
    serialBT.flush();
    serialBT.disconnect();
    serialBT.end();
    _is_init = false;
  }
}

u_char Bluetooth::read()
{
  return serialBT.read();
}

void Bluetooth::treat_bluetooth_data(int &received_data)
{
  static bool is_prefix = true;
  static String prefix = "";
  static String value = "";

  if (received_data != -1)
  {
    if (received_data != 10 && received_data != 13)
    {
      if (is_prefix)
      {
        if (received_data == 58)
        {
          is_prefix = false;
        }
        else
        {
          prefix += (char)received_data;
        }
      }
      else
      {
        value += (char)received_data;
      }
    }
    else
    {
      is_prefix = true;
      if (prefix == "ssid")
      {
        Wifi::ssid = value;
      }
      else if (prefix == "pwd")
      {
        Wifi::pwd = value;
        Wifi::connect();
      }
      value = prefix = "";
    }
  }
}