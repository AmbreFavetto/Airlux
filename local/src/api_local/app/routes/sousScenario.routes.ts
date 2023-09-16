import express from 'express';
import { getSousScenarios, createSousScenario, getSousScenario, deleteSousScenario } from '../controllers/sousScenario.controller';
import { authenticateToken } from '../util/token';

const sousScenarioRoutes = express.Router();

sousScenarioRoutes.route('/')
  .get(authenticateToken, getSousScenarios)
  .post(authenticateToken, createSousScenario);

sousScenarioRoutes.route('/:id')
  .get(authenticateToken, getSousScenario)
  .delete(authenticateToken, deleteSousScenario);

export default sousScenarioRoutes;