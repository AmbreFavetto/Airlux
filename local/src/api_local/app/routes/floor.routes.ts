import express from 'express';
import { getFloors, createFloor, getFloor, deleteFloor, updateFloor } from '../controllers/floor.controller';
import { authenticateToken } from '../util/token';

const floorRoutes = express.Router();

floorRoutes.route('/')
  .get(authenticateToken, getFloors)
  .post(authenticateToken, createFloor);

floorRoutes.route('/:id')
  .get(authenticateToken, getFloor)
  .put(authenticateToken, updateFloor)
  .delete(authenticateToken, deleteFloor);

export default floorRoutes;