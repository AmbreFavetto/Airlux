import express from 'express';
import { getRooms, createRoom, getRoom, deleteRoom, updateRoom } from '../controllers/room.controller.js';

const roomRoutes = express.Router();

roomRoutes.route('/room/')
  .get(getRooms)
  .post(createRoom);

  roomRoutes.route('/room/:id')
  .get(getRoom)
  .put(updateRoom)
  .delete(deleteRoom);

export default roomRoutes;