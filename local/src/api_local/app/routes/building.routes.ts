import express from 'express';
import { getBuilding, getBuildings, createBuilding, deleteBuilding, updateBuilding } from '../controllers/building.controller';
import { authenticateToken } from '../util/token';

const buildingRoutes = express.Router();

buildingRoutes.route('/')
  .post(authenticateToken, createBuilding)
  .get(authenticateToken, getBuildings);

buildingRoutes.route('/:id')
  .get(authenticateToken, getBuilding)
  .put(authenticateToken, updateBuilding)
  .delete(authenticateToken, deleteBuilding);

export default buildingRoutes;