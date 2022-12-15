import express from 'express';
import { getUsers, createUser, getUser, deleteUser, updateUser } from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.route('/')
  .get(getUsers)
  .post(createUser);

  userRoutes.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default userRoutes;