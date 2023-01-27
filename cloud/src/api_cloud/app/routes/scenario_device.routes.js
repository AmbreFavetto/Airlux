import express from 'express';
import { getScenariosDevices, createScenarioDevice, getScenarioDevice, deleteScenarioDevice, updateScenarioDevice } from '../controllers/scenario_device.controller.js';

const scenario_deviceRoutes = express.Router();

scenario_deviceRoutes.route('/')
  .get(getScenariosDevices)
  .post(createScenarioDevice);

  scenario_deviceRoutes.route('/:id')
  .get(getScenarioDevice)
  .put(updateScenarioDevice)
  .delete(deleteScenarioDevice);

export default scenario_deviceRoutes;