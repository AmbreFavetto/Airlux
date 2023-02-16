class Wifi
{
private:
  Wifi() = default;

  static bool _is_connected;

public:
  static String ssid;
  static String pwd;

  static void connect();

  static bool is_connected();
};
