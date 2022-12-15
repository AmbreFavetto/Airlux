import express from 'express';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';
import Response from './domain/response.js';
import HttpStatusBuilding from './controllers/building.controller.js';
import HttpStatusDevice from './controllers/device.controller.js';
import HttpStatusFloor from './controllers/floor.controller.js';
import HttpStatusRoom from './controllers/room.controller.js';
import HttpStatusUser from './controllers/user.controller.js';
import routesBuilding from './routes/building.routes.js';
import routesDevice from './routes/device.routes.js';
import routesFloor from './routes/floor.routes.js';
import routesRoom from './routes/room.routes.js';
import routesUser from './routes/user.routes.js';
import logger from './util/logger.js';


dotenv.config();
const PORT = 3000;
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

//Building
app.use('/building/', routesBuilding);
app.get('/building', (req, res) => res.send(new Response(HttpStatusBuilding.OK.code, HttpStatusBuilding.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));
app.post('/building',)
//Device
app.use('/device/', routesDevice);
app.get('/device', (req, res) => res.send(new Response(HttpStatusDevice.OK.code, HttpStatusDevice.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//Floor
app.use('/floor/', routesFloor);
app.get('/floor', (req, res) => res.send(new Response(HttpStatusFloor.OK.code, HttpStatusFloor.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//Room
app.use('/room/', routesRoom);
app.get('/room', (req, res) => res.send(new Response(HttpStatusRoom.OK.code, HttpStatusRoom.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//User
app.use('/user/', routesUser);
app.get('/user', (req, res) => res.send(new Response(HttpStatusUser.OK.code, HttpStatusUser.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));
app.all('*', (req, res) => res.status(HttpStatusUser.NOT_FOUND.code)
  .send(new Response(HttpStatusUser.NOT_FOUND.code, HttpStatusUser.NOT_FOUND.status, 'Route does not exist on the server')));


app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));
