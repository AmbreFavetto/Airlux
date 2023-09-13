import express from 'express';
import { syncLog } from '../controllers/syncLog.controller'

const syncLogRoutes = express.Router();

syncLogRoutes.route('/')
    .post(syncLog)

export default syncLogRoutes;
