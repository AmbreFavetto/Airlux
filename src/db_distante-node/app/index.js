import express from 'express';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';
import Response from './domain/response.js';
import HttpStatusBatiment from './controllers/batiment.controller.js';
import HttpStatusDevice from './controllers/device.controller.js';
import HttpStatusFloor from './controllers/floor.controller.js';
import HttpStatusRoom from './controllers/room.controller.js';
import HttpStatusUser from './controllers/user.controller.js';
import routesBatiment from './routes/batiment.routes.js';
import routesDevice from './routes/device.routes.js';
import routesFloor from './routes/floor.routes.js';
import routesRoom from './routes/room.routes.js';
import routesUser from './routes/user.routes.js';
import logger from './util/logger.js';


dotenv.config();
const PORT = 8000;
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

//Batiment
app.use('/', routesBatiment);
app.get('/', (req, res) => res.send(new Response(HttpStatusBatiment.OK.code, HttpStatusBatiment.OK.status, 'Airlux DB distante API, v1.0.0 - All Systems Go')));
app.all('*', (req, res) => res.status(HttpStatusBatiment.NOT_FOUND.code)
  .send(new Response(HttpStatusBatiment.NOT_FOUND.code, HttpStatusBatiment.NOT_FOUND.status, 'Route does not exist on the server')));

//Device
app.use('/', routesDevice);
app.get('/', (req, res) => res.send(new Response(HttpStatusDevice.OK.code, HttpStatusDevice.OK.status, 'Airlux DB distante API, v1.0.0 - All Systems Go')));
app.all('*', (req, res) => res.status(HttpStatusDevice.NOT_FOUND.code)
  .send(new Response(HttpStatusDevice.NOT_FOUND.code, HttpStatusDevice.NOT_FOUND.status, 'Route does not exist on the server')));


//Floor
app.use('/', routesFloor);
app.get('/', (req, res) => res.send(new Response(HttpStatusFloor.OK.code, HttpStatusFloor.OK.status, 'Airlux DB distante API, v1.0.0 - All Systems Go')));
app.all('*', (req, res) => res.status(HttpStatusFloor.NOT_FOUND.code)
  .send(new Response(HttpStatusFloor.NOT_FOUND.code, HttpStatusFloor.NOT_FOUND.status, 'Route does not exist on the server')));


//Room
app.use('/', routesRoom);
app.get('/', (req, res) => res.send(new Response(HttpStatusRoom.OK.code, HttpStatusRoom.OK.status, 'Airlux DB distante API, v1.0.0 - All Systems Go')));
app.all('*', (req, res) => res.status(HttpStatusRoom.NOT_FOUND.code)
  .send(new Response(HttpStatusRoom.NOT_FOUND.code, HttpStatusRoom.NOT_FOUND.status, 'Route does not exist on the server')));


//User
app.use('/', routesUser);
app.get('/', (req, res) => res.send(new Response(HttpStatusUser.OK.code, HttpStatusUser.OK.status, 'Airlux DB distante API, v1.0.0 - All Systems Go')));
app.all('*', (req, res) => res.status(HttpStatusUser.NOT_FOUND.code)
  .send(new Response(HttpStatusUser.NOT_FOUND.code, HttpStatusUser.NOT_FOUND.status, 'Route does not exist on the server')));


app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));