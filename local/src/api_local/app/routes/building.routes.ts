import express from 'express';
import { getBuilding, createBuilding, getBuildings, deleteBuilding, updateBuilding } from '../controllers/building.controller';

const buildingRoutes = express.Router();

buildingRoutes.route('/')
  .get(getBuildings)
  .post(createBuilding);

buildingRoutes.route('/:id')
  .get(getBuilding)
  .put(updateBuilding)
  .delete(deleteBuilding);

export default buildingRoutes;