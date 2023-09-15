import express from 'express';
import { getSousScenarios, createSousScenario, getSousScenario, deleteSousScenario } from '../controllers/sousScenario.controller';

const sousScenarioRoutes = express.Router();

sousScenarioRoutes.route('/')
  .get(getSousScenarios)
  .post(createSousScenario);

sousScenarioRoutes.route('/:id')
  .get(getSousScenario)
  .delete(deleteSousScenario);

export default sousScenarioRoutes;