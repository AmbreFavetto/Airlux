/// @brief
class Bluetooth
{
private:
  static bool _is_init;

  Bluetooth() = default;

public:
  static bool is_init();

  static bool is_available();

  static void start();

  static void stop();

  static u_char read();

  static void treat_bluetooth_data(int &received_data);
};