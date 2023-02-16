#include <Arduino.h>

#include "gpio.h"

#define PAIRING_BUTTON_PIN 2
#define PAIRING_LED_PIN 4

bool GPIO::pairing_button_last_state = BUTTON_RELEASED;
bool GPIO::pairing_button_state = BUTTON_RELEASED;
bool GPIO::current_led_state = LED_DISABLED;

uint64_t GPIO::pairing_button_pressed_ms = 0;

void GPIO::init_gpio()
{
  pinMode(PAIRING_BUTTON_PIN, INPUT_PULLDOWN);
  pinMode(PAIRING_LED_PIN, OUTPUT);
}

void GPIO::read_digital_input()
{
  pairing_button_state = digitalRead(PAIRING_BUTTON_PIN);
}

void GPIO::write_digital_output()
{
  digitalWrite(PAIRING_LED_PIN, current_led_state);
}

void GPIO::led_blink(int blink_time_ms, int current_timestamp_ms)
{
  static int current_state_timestamp_ms = 0;

  if (current_timestamp_ms - current_state_timestamp_ms > blink_time_ms)
  {
    current_state_timestamp_ms = current_timestamp_ms;
    if (current_led_state == LED_DISABLED)
    {
      current_led_state = LED_ENABLED;
    }
    else
    {
      current_led_state = LED_DISABLED;
    }
  }
}