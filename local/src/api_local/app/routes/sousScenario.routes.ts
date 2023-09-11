import express from 'express';
import { getSousScenarios, createSousScenario, getSousScenario, deleteSousScenario, updateSousScenario } from '../controllers/sousScenario.controller';

const sousScenarioRoutes = express.Router();

sousScenarioRoutes.route('/')
  .get(getSousScenarios)
  .post(createSousScenario);

sousScenarioRoutes.route('/:id')
  .get(getSousScenario)
  .put(updateSousScenario)
  .delete(deleteSousScenario);

export default sousScenarioRoutes;