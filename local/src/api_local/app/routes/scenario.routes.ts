import express from 'express';
import { getScenarios, createScenario, getScenario, deleteScenario, updateScenario } from '../controllers/scenario.controller';
import { authenticateToken } from '../util/token';

const scenarioRoutes = express.Router();

scenarioRoutes.route('/')
  .get(authenticateToken, getScenarios)
  .post(authenticateToken, createScenario);

scenarioRoutes.route('/:id')
  .get(authenticateToken, getScenario)
  .put(authenticateToken, updateScenario)
  .delete(authenticateToken, deleteScenario);

export default scenarioRoutes;