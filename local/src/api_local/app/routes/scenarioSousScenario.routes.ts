import express from 'express';
import { getScenariosSousScenarios, createScenarioSousScenario, getScenarioSousScenario, deleteScenarioSousScenario } from '../controllers/scenarioSousScenario.controller';

const scenarioSousScenarioRoutes = express.Router();

scenarioSousScenarioRoutes.route('/')
  .get(getScenariosSousScenarios)
  .post(createScenarioSousScenario);

scenarioSousScenarioRoutes.route('/:id')
  .get(getScenarioSousScenario)
  .delete(deleteScenarioSousScenario);

export default scenarioSousScenarioRoutes;