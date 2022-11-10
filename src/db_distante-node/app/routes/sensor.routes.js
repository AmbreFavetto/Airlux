import express from 'express';
import { getSensors, createSensor, getSensor, deleteSensor, updateSensor } from '../controllers/sensor.controller.js';

const sensorRoutes = express.Router();

sensorRoutes.route('/')
  .get(getSensors)
  .post(createSensor);

  sensorRoutes.route('/:id')
  .get(getSensor)
  .put(updateSensor)
  .delete(deleteSensor);

export default sensorRoutes;