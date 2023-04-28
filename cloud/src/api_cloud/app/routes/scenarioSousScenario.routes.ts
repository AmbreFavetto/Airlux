import express from 'express';
import { getScenariosSousScenarios, createScenarioSousScenario, getScenarioSousScenario, deleteScenarioSousScenario, updateScenarioSousScenario } from '../controllers/scenarioSousScenario.controller';

const scenarioSousScenarioRoutes = express.Router();

scenarioSousScenarioRoutes.route('/')
  .get(getScenariosSousScenarios)
  .post(createScenarioSousScenario);

scenarioSousScenarioRoutes.route('/:id')
  .get(getScenarioSousScenario)
  .put(updateScenarioSousScenario)
  .delete(deleteScenarioSousScenario);

export default scenarioSousScenarioRoutes;