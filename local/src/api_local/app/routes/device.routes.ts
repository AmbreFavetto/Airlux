import express from 'express';
import { getDevices, createDevice, getDevice, deleteDevice, updateDevice } from '../controllers/device.controller';

const deviceRoutes = express.Router();

deviceRoutes.route('/')
  .get(getDevices)
  .post(createDevice);

deviceRoutes.route('/:id')
  .get(getDevice)
  .put(updateDevice)
  .delete(deleteDevice);

export default deviceRoutes;