import express from 'express';
import { getUsersBuildings, createUserBuilding, getUserBuilding, deleteUserBuilding } from '../controllers/userBuilding.controller';

const userBuildingRoutes = express.Router();

userBuildingRoutes.route('/')
  .get(getUsersBuildings)
  .post(createUserBuilding);

userBuildingRoutes.route('/:id')
  .get(getUserBuilding)
  .delete(deleteUserBuilding);

export default userBuildingRoutes;