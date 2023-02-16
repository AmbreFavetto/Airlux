
enum BEHAVIOUR_STATE : uint8_t
{
  BEHAVIOUR_STATE_INIT = 0,
  BEHAVIOUR_STATE_STANDBY = 1,
  BEHAVIOUR_STATE_PAIRING = 2
};

class Behaviour
{
private:
  Behaviour();

  static uint8_t behaviour_state;
  static uint64_t current_timestamp_ms;
  static uint64_t current_state_timestamp_ms;

  static void treat_bluetooth_data(int &received_data);

  static void end_pairing();

  static void behaviour_process_standby();

  static void behaviour_process_pairing();

  static void process_before_state();

public:
  static void behaviour_process();

  static void behaviour_process_init();
};