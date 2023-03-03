const QUERY = {
  SELECT_SCENARIOS: 'SELECT * FROM scenario ORDER BY scenario_id DESC LIMIT 100',
  SELECT_SCENARIO: 'SELECT * FROM scenario WHERE scenario_id = ?',
  CREATE_SCENARIO: 'INSERT INTO scenario(name, scenario_id) VALUES (?, ?)',
  UPDATE_SCENARIO: 'UPDATE scenario SET name = ? WHERE scenario_id = ?',
  DELETE_SCENARIO: 'DELETE FROM scenario WHERE scenario_id = ?',
  SELECT_DEVICE: 'SELECT * FROM device WHERE device_id = ?',
};

export default QUERY;