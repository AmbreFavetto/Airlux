import express from 'express';
import { getBuilding, createBuilding, getBuildings, deleteBuilding, updateBuilding } from '../controllers/building.controller';
import { authenticateToken } from '../util/token';

const buildingRoutes = express.Router();

buildingRoutes.route('/')
  .get(authenticateToken, getBuildings)
  .post(authenticateToken, createBuilding);

buildingRoutes.route('/:id')
  .get(authenticateToken, getBuilding)
  .put(authenticateToken, updateBuilding)
  .delete(authenticateToken, deleteBuilding);

export default buildingRoutes;