import express from 'express';
import { getBuilding, createBuilding, getBuildings, deleteBuilding, updateBuilding } from '../controllers/building.controller.js';

const buildingRoutes = express.Router();

buildingRoutes.route('/building/')
  .get(getBuildings)
  .post(createBuilding);

  buildingRoutes.route('/building/:id')
  .get(getBuilding)
  .put(updateBuilding)
  .delete(deleteBuilding);

export default buildingRoutes;