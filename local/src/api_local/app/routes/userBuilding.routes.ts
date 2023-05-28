import express from 'express';
import { getUsersBuildings, createUserBuilding, getUserBuilding, deleteUserBuilding, updateUserBuilding } from '../controllers/userBuilding.controller';

const userBuildingRoutes = express.Router();

userBuildingRoutes.route('/')
  .get(getUsersBuildings)
  .post(createUserBuilding);

userBuildingRoutes.route('/:id')
  .get(getUserBuilding)
  .put(updateUserBuilding)
  .delete(deleteUserBuilding);

export default userBuildingRoutes;