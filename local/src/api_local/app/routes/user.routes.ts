import express from 'express';
import { authenticateToken } from '../util/token';
import { getUsers, createUser, getUser, deleteUser, updateUser, login } from '../controllers/user.controller';

const userRoutes = express.Router();

userRoutes.route('/')
  .get(authenticateToken, getUsers)
  .post(createUser)

userRoutes.route('/login')
  .post(login);

userRoutes.route('/:id')
  .get(authenticateToken, getUser)
  .put(authenticateToken, updateUser)
  .delete(authenticateToken, deleteUser);

export default userRoutes;