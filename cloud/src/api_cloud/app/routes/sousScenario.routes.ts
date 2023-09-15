import express from 'express';
import { getSousScenarios, createSousScenario, getSousScenario, deleteSousScenario } from '../controllers/sousScenario.controller';

const scenarioRoutes = express.Router();

scenarioRoutes.route('/')
  .get(getSousScenarios)
  .post(createSousScenario);

scenarioRoutes.route('/:id')
  .get(getSousScenario)
  .delete(deleteSousScenario);

export default scenarioRoutes;