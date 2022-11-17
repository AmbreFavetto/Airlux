import express from 'express';
import { getBatiments, createBatiment, getBatiment, deleteBatiment, updateBatiment } from '../controllers/batiment.controller.js';

const batimentRoutes = express.Router();

batimentRoutes.route('/')
  .get(getBatiments)
  .post(createBatiment);

  batimentRoutes.route('/:id')
  .get(getBatiment)
  .put(updateBatiment)
  .delete(deleteBatiment);

export default batimentRoutes;