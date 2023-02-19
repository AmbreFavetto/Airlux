import express from 'express';
import { getUsersBuildings, createUserBuilding, getUserBuilding, deleteUserBuilding, updateUserBuilding } from '../controllers/user_building.controller';

const user_buildingRoutes = express.Router();

user_buildingRoutes.route('/')
  .get(getUsersBuildings)
  .post(createUserBuilding);

  user_buildingRoutes.route('/:id')
  .get(getUserBuilding)
  .put(updateUserBuilding)
  .delete(deleteUserBuilding);

export default user_buildingRoutes;