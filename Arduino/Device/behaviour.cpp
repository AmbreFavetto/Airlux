#include <Arduino.h>

#include "behaviour.h"
#include "gpio.h"
#include "bluetooth.h"
#include "wifi.h"

#define PAIRING_LED_BLINKING_TIME_MS 200
#define PAIRING_TIME_MS 60000
#define PAIRING_TIME_BUTTON_PRESSED_MS 3000

uint8_t Behaviour::behaviour_state;
uint64_t Behaviour::current_timestamp_ms = 0;
uint64_t Behaviour::current_state_timestamp_ms = 0;

void Behaviour::process_before_state()
{
  current_timestamp_ms = millis();
  GPIO::read_digital_input();
  GPIO::write_digital_output();
}

void Behaviour::behaviour_process()
{
  process_before_state();

  switch (behaviour_state)
  {
  case BEHAVIOUR_STATE_INIT:
    behaviour_process_init();
    break;
  case BEHAVIOUR_STATE_PAIRING:
    behaviour_process_pairing();
    break;
  case BEHAVIOUR_STATE_STANDBY:
    behaviour_process_standby();
    break;

  default:
    // Do nothing
    break;
  }
}

void Behaviour::behaviour_process_init()
{
  GPIO::init_gpio();

  behaviour_state = BEHAVIOUR_STATE_STANDBY;
}

void Behaviour::behaviour_process_standby()
{
  // Button just released
  if (GPIO::pairing_button_state == BUTTON_RELEASED && GPIO::pairing_button_last_state == BUTTON_PRESSED)
  {
    GPIO::pairing_button_last_state = GPIO::pairing_button_state;
  }

  // Button just pressed
  if (GPIO::pairing_button_state == BUTTON_PRESSED && GPIO::pairing_button_last_state == BUTTON_RELEASED)
  {
    GPIO::pairing_button_pressed_ms = current_timestamp_ms;
    GPIO::pairing_button_last_state = GPIO::pairing_button_state;
  }

  // Button curently pressed
  if (GPIO::pairing_button_state == BUTTON_PRESSED && GPIO::pairing_button_last_state == BUTTON_PRESSED)
  {
    // Button pressed for 3 seconds
    if (current_timestamp_ms - GPIO::pairing_button_pressed_ms > PAIRING_TIME_BUTTON_PRESSED_MS)
    {
      behaviour_state = BEHAVIOUR_STATE_PAIRING;
      current_state_timestamp_ms = current_timestamp_ms;
      Serial.println("Pairing mode");
    }
  }
}

void Behaviour::behaviour_process_pairing()
{
  if (current_timestamp_ms - current_state_timestamp_ms < PAIRING_TIME_MS)
  {
    GPIO::led_blink(PAIRING_LED_BLINKING_TIME_MS, current_timestamp_ms);

    Bluetooth::start();

    if (Bluetooth::is_init())
    {
      if (Bluetooth::is_available())
      {
        int received_data = Bluetooth::read();
        Bluetooth::treat_bluetooth_data(received_data);
      }
      if (Wifi::is_connected())
      {
        end_pairing();
      }
    }
  }
  else
  {
    end_pairing();
  }
}

void Behaviour::end_pairing()
{
  Serial.println("StandBy mode");
  GPIO::current_led_state = LED_DISABLED;
  behaviour_state = BEHAVIOUR_STATE_STANDBY;
}
