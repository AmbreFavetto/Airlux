import express from 'express';
import { getSousScenarios, createSousScenario, getSousScenario, deleteSousScenario } from '../controllers/sousScenario.controller';
import { authenticateToken } from '../util/token';

const scenarioRoutes = express.Router();

scenarioRoutes.route('/')
  .get(authenticateToken, getSousScenarios)
  .post(authenticateToken, createSousScenario);

scenarioRoutes.route('/:id')
  .get(authenticateToken, getSousScenario)
  .delete(authenticateToken, deleteSousScenario);

export default scenarioRoutes;