
enum BUTTON_STATE : bool
{
  BUTTON_RELEASED = false,
  BUTTON_PRESSED = true
};

enum LED_STATE : bool
{
  LED_DISABLED = false,
  LED_ENABLED = true
};

class GPIO
{
private:
  GPIO() = default;

public:
  static bool pairing_button_last_state;
  static bool pairing_button_state;
  static bool current_led_state;

  static uint64_t pairing_button_pressed_ms;

  static void init_gpio();

  static void read_digital_input();

  static void write_digital_output();

  static void led_blink(int blink_time_ms, int current_timestamp_ms);
};