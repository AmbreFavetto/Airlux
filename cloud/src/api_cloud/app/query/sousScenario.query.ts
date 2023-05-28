const QUERY = {
  SELECT_SOUS_SCENARIOS: 'SELECT * FROM sousScenario ORDER BY sousScenario_id DESC LIMIT 100',
  SELECT_SOUS_SCENARIO: 'SELECT * FROM sousScenario WHERE sousScenario_id = ?',
  CREATE_SOUS_SCENARIO: 'INSERT INTO sousScenario(action, device_id, sousScenario_id) VALUES (?, ?, ?)',
  UPDATE_SOUS_SCENARIO: 'UPDATE sousScenario SET action = ? device_id = ? WHERE sousScenario_id = ?',
  DELETE_SOUS_SCENARIO: 'DELETE FROM sousScenario WHERE sousScenario_id = ?',
  SELECT_DEVICE: 'SELECT * FROM device WHERE device_id = ?',
};

export default QUERY;