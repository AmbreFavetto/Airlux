const QUERY = {
  SELECT_SOUS_SCENARIOS: 'SELECT * FROM sousScenario ORDER BY sous_scenario_id DESC LIMIT 100',
  SELECT_SOUS_SCENARIO: 'SELECT * FROM sousScenario WHERE sous_scenario_id = ?',
  CREATE_SOUS_SCENARIO: 'INSERT INTO sousScenario(action, device_id, sous_scenario_id) VALUES (?, ?, ?)',
  UPDATE_SOUS_SCENARIO: 'UPDATE sousScenario SET action = ? device_id = ? WHERE sous_scenario_id = ?',
  DELETE_SOUS_SCENARIO: 'DELETE FROM sousScenario WHERE sous_scenario_id = ?',
  SELECT_DEVICE: 'SELECT * FROM device WHERE device_id = ?',
};

export default QUERY;