import express from 'express';
import { getUsersBuildings, createUserBuilding, getUserBuilding, deleteUserBuilding } from '../controllers/userBuilding.controller';
import { authenticateToken } from '../util/token';

const userBuildingRoutes = express.Router();

userBuildingRoutes.route('/')
  .get(authenticateToken, getUsersBuildings)
  .post(authenticateToken, createUserBuilding);

userBuildingRoutes.route('/:id')
  .get(authenticateToken, getUserBuilding)
  .delete(authenticateToken, deleteUserBuilding);

export default userBuildingRoutes;