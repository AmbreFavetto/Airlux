const QUERY = {
  SELECT_SCENARIOS_SOUS_SCENARIOS: 'SELECT * FROM scenarioSousScenario ORDER BY id DESC LIMIT 100',
  SELECT_SCENARIO_SOUS_SCENARIO: 'SELECT * FROM scenarioSousScenario WHERE id = ?',
  CREATE_SCENARIO_SOUS_SCENARIO: 'INSERT INTO scenarioSousScenario(scenario_id, sous_scenario_id, id) VALUES (?, ?, ?)',
  UPDATE_SCENARIO_SOUS_SCENARIO: 'UPDATE scenarioSousScenario SET scenario_id = ?, sous_scenario_id = ? WHERE id = ?',
  DELETE_SCENARIO_SOUS_SCENARIO: 'DELETE FROM scenarioSousScenario WHERE id = ?',
  SELECT_SCENARIO: 'SELECT * FROM scenario WHERE scenario_id = ?',
  SELECT_SOUS_SCENARIO: 'SELECT * FROM sousScenario WHERE sous_scenario_id = ?',
};

export default QUERY;