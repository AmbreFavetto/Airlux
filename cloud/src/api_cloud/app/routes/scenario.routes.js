import express from 'express';
import { getScenarios, createScenario, getScenario, deleteScenario, updateScenario } from '../controllers/scenario.controller.js';

const scenarioRoutes = express.Router();

scenarioRoutes.route('/')
  .get(getScenarios)
  .post(createScenario);

  scenarioRoutes.route('/:id')
  .get(getScenario)
  .put(updateScenario)
  .delete(deleteScenario);

export default scenarioRoutes;