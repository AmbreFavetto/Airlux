import express from 'express';
import { getUsers, createUser, getUser, deleteUser, updateUser } from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.route('/user/')
  .get(getUsers)
  .post(createUser);

  userRoutes.route('/user/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default userRoutes;