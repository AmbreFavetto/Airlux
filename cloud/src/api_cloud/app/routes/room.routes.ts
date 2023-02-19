import express from 'express';
import { getRooms, createRoom, getRoom, deleteRoom, updateRoom } from '../controllers/room.controller';

const roomRoutes = express.Router();

roomRoutes.route('/')
  .get(getRooms)
  .post(createRoom);

  roomRoutes.route('/:id')
  .get(getRoom)
  .put(updateRoom)
  .delete(deleteRoom);

export default roomRoutes;