import express from 'express';
import { getActuators, createActuator, getActuator, deleteActuator, updateActuator } from '../controllers/actuator.controller.js';

const actuatorRoutes = express.Router();

actuatorRoutes.route('/')
  .get(getActuators)
  .post(createActuator);

  actuatorRoutes.route('/:id')
  .get(getActuator)
  .put(updateActuator)
  .delete(deleteActuator);

export default actuatorRoutes;