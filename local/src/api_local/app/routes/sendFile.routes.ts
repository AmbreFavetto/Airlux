import express from 'express';
import { sendFile } from '../controllers/sendFile.controllers'

const sendFileRoutes = express.Router();

sendFileRoutes.route('/')
    .post(sendFile)

export default sendFileRoutes;
