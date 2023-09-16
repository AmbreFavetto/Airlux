import express from 'express';
import { getUsersBuildings, createUserBuilding, getUserBuilding, deleteUserBuilding } from '../controllers/userBuilding.controller';
import { authenticateToken } from '../util/token';

const user_buildingRoutes = express.Router();

user_buildingRoutes.route('/')
  .get(authenticateToken, getUsersBuildings)
  .post(authenticateToken, createUserBuilding);

user_buildingRoutes.route('/:id')
  .get(authenticateToken, getUserBuilding)
  .delete(authenticateToken, deleteUserBuilding);

export default user_buildingRoutes;