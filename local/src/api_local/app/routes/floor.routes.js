import express from 'express';
import { getFloors, createFloor, getFloor, deleteFloor, updateFloor } from '../controllers/floor.controller.js';

const floorRoutes = express.Router();

floorRoutes.route('/floor/')
  .get(getFloors)
  .post(createFloor);

  floorRoutes.route('/floor/:id')
  .get(getFloor)
  .put(updateFloor)
  .delete(deleteFloor);

export default floorRoutes;