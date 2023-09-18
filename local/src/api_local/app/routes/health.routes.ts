import express from 'express';
import { health } from '../controllers/health.controller';

const healthRoutes = express.Router();

healthRoutes.route('/')
    .get(health);

export default healthRoutes;