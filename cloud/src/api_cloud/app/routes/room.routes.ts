import express from 'express';
import { getRooms, createRoom, getRoom, deleteRoom, updateRoom } from '../controllers/room.controller';
import { authenticateToken } from '../util/token';

const roomRoutes = express.Router();

roomRoutes.route('/')
  .get(authenticateToken, getRooms)
  .post(authenticateToken, createRoom);

roomRoutes.route('/:id')
  .get(authenticateToken, getRoom)
  .put(authenticateToken, updateRoom)
  .delete(authenticateToken, deleteRoom);

export default roomRoutes;