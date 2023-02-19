const QUERY = {
    SELECT_SCENARIOS_DEVICES: 'SELECT * FROM scenario_device ORDER BY id DESC LIMIT 100',
    SELECT_SCENARIO_DEVICE: 'SELECT * FROM scenario_device WHERE id = ?',
    CREATE_SCENARIO_DEVICE: 'INSERT INTO scenario_device(scenario_id, device_id, id) VALUES (?, ?, ?)',
    UPDATE_SCENARIO_DEVICE: 'UPDATE scenario_device SET scenario_id = ?, device_id = ? WHERE id = ?',
    DELETE_SCENARIO_DEVICE: 'DELETE FROM scenario_device WHERE id = ?',
    SELECT_SCENARIO: 'SELECT * FROM scenario WHERE id = ?',
    SELECT_DEVICE: 'SELECT * FROM device WHERE id = ?',
  };
  
  export default QUERY;