import express from 'express';
import { getUsersBuildings, createUserBuilding, getUserBuilding, deleteUserBuilding } from '../controllers/userBuilding.controller';

const user_buildingRoutes = express.Router();

user_buildingRoutes.route('/')
  .get(getUsersBuildings)
  .post(createUserBuilding);

user_buildingRoutes.route('/:id')
  .get(getUserBuilding)
  .delete(deleteUserBuilding);

export default user_buildingRoutes;