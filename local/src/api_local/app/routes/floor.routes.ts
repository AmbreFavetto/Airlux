import express from 'express';
import { getFloors, createFloor, getFloor, deleteFloor, updateFloor } from '../controllers/floor.controller';

const floorRoutes = express.Router();

floorRoutes.route('/')
  .get(getFloors)
  .post(createFloor);

floorRoutes.route('/:id')
  .get(getFloor)
  .put(updateFloor)
  .delete(deleteFloor);

export default floorRoutes;