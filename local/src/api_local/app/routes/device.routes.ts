import express from 'express';
import { getDevices, createDevice, getDevice, deleteDevice, updateDevice } from '../controllers/device.controller';
import { authenticateToken } from '../util/token';

const deviceRoutes = express.Router();

deviceRoutes.route('/')
  .get(authenticateToken, getDevices)
  .post(authenticateToken, createDevice);

deviceRoutes.route('/:id')
  .get(authenticateToken, getDevice)
  .put(authenticateToken, updateDevice)
  .delete(authenticateToken, deleteDevice);

export default deviceRoutes;