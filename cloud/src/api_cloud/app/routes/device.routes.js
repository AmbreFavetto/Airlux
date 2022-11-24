import express from 'express';
import { getDevices, createDevice, getDevice, deleteDevice, updateDevice } from '../controllers/device.controller.js';

const deviceRoutes = express.Router();

deviceRoutes.route('/device/')
  .get(getDevices)
  .post(createDevice);

  deviceRoutes.route('/device/:id')
  .get(getDevice)
  .put(updateDevice)
  .delete(deleteDevice);

export default deviceRoutes;