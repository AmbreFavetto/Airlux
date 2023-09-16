import express from 'express';
import { getScenariosSousScenarios, createScenarioSousScenario, getScenarioSousScenario, deleteScenarioSousScenario } from '../controllers/scenarioSousScenario.controller';
import { authenticateToken } from '../util/token';

const scenarioSousScenarioRoutes = express.Router();

scenarioSousScenarioRoutes.route('/')
  .get(authenticateToken, getScenariosSousScenarios)
  .post(authenticateToken, createScenarioSousScenario);

scenarioSousScenarioRoutes.route('/:id')
  .get(authenticateToken, getScenarioSousScenario)
  .delete(authenticateToken, deleteScenarioSousScenario);

export default scenarioSousScenarioRoutes;