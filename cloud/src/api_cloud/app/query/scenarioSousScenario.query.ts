const QUERY = {
  SELECT_SCENARIOS_SOUS_SCENARIOS: 'SELECT * FROM scenario_sous_scenario ORDER BY id DESC LIMIT 100',
  SELECT_SCENARIO_SOUS_SCENARIO: 'SELECT * FROM scenario_sous_scenario WHERE id = ?',
  CREATE_SCENARIO_SOUS_SCENARIO: 'INSERT INTO scenario_sous_scenario(scenario_id, sous_scenario_id, id) VALUES (?, ?, ?)',
  UPDATE_SCENARIO_SOUS_SCENARIO: 'UPDATE scenario_sous_scenario SET scenario_id = ?, sous_scenario_id = ? WHERE id = ?',
  DELETE_SCENARIO_SOUS_SCENARIO: 'DELETE FROM scenario_device WHERE id = ?',
  SELECT_SCENARIO: 'SELECT * FROM scenario WHERE scenario_id = ?',
  SELECT_SOUS_SCENARIO: 'SELECT * FROM sous_scenario WHERE sous_scenario_id = ?',
};

export default QUERY;