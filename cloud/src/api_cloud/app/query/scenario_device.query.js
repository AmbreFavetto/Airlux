const QUERY = {
    SELECT_SCENARIOS_DEVICES: 'SELECT * FROM scenario_device ORDER BY id DESC LIMIT 100',
    SELECT_SCENARIO_DEVICE: 'SELECT * FROM scenario_device WHERE id = ?',
    CREATE_SCENARIO_DEVICE: 'INSERT INTO scenario_device(scenario_id, device_id, enable_device) VALUES (?, ?, ?)',
    UPDATE_SCENARIO_DEVICE: 'UPDATE scenario_device SET scenario_id = ?, device_id = ?, enable_device = ? WHERE id = ?',
    DELETE_SCENARIO_DEVICE: 'DELETE FROM scenario_device WHERE id = ?',
    CREATE_SCENARIO_DEVICE_PROCEDURE: 'CALL create_scenario_device_and_return(?, ?, ?)'
  };
  
  export default QUERY;