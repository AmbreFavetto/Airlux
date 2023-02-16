#include <Arduino.h>
#include "behaviour.h"

void setup()
{
  Behaviour::behaviour_process_init();
  Serial.begin(115200);
}

void loop()
{
  Behaviour::behaviour_process();
}