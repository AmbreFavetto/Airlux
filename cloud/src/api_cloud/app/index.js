import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';
import Response from './domain/response.js';
import HttpStatusBuilding from './controllers/building.controller.js';
import HttpStatusDevice from './controllers/device.controller.js';
import HttpStatusFloor from './controllers/floor.controller.js';
import HttpStatusRoom from './controllers/room.controller.js';
import HttpStatusUser from './controllers/user.controller.js';
import HttpStatusTimeseries from './controllers/timeseries.controller.js';
import routesBuilding from './routes/building.routes.js';
import routesDevice from './routes/device.routes.js';
import routesScenarioDevice from './routes/scenario_device.routes.js';
import routesScenario from './routes/scenario.routes.js';
import routesFloor from './routes/floor.routes.js';
import routesRoom from './routes/room.routes.js';
import routesUser from './routes/user.routes.js';
import routesUserBuilding from './routes/user_building.routes.js';
import routesTimeseries from './routes/timeseries.routes.js';
import logger from './util/logger.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
const PORT = 3000;
const app = express();
const server = createServer(app);
const socketio = new Server(server);
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//Building
app.use('/building/', routesBuilding);
app.get('/building', (req, res) => res.send(new Response(HttpStatusBuilding.OK.code, HttpStatusBuilding.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//Device
app.use('/device/', routesDevice);
app.get('/device', (req, res) => res.send(new Response(HttpStatusDevice.OK.code, HttpStatusDevice.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//ScenarioDevice
app.use('/scenario_device/', routesScenarioDevice);
app.get('/scenario_device', (req, res) => res.send(new Response(HttpStatusScenarioDevice.OK.code, HttpStatusScenarioDevice.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//Scenario
app.use('/scenario/', routesScenario);
app.get('/scenario', (req, res) => res.send(new Response(HttpStatusScenario.OK.code, HttpStatusScenario.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//Floor
app.use('/floor/', routesFloor);
app.get('/floor', (req, res) => res.send(new Response(HttpStatusFloor.OK.code, HttpStatusFloor.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//Room
app.use('/room/', routesRoom);
app.get('/room', (req, res) => res.send(new Response(HttpStatusRoom.OK.code, HttpStatusRoom.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//User
app.use('/user/', routesUser);
app.get('/user', (req, res) => res.send(new Response(HttpStatusUser.OK.code, HttpStatusUser.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//UserBuilding
app.use('/user_building/', routesUserBuilding);
app.get('/user_building', (req, res) => res.send(new Response(HttpStatusUserBuilding.OK.code, HttpStatusUserBuilding.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

//Timesries
app.use('/timeseries/', routesTimeseries);
app.get('/timeseries', (req, res) => res.send(new Response(HttpStatusTimeseries.OK.code, HttpStatusTimeseries.OK.status, 'Airlux cloud DB API, v1.0.0 - All Systems Go')));

app.all('*', (req, res) => res.status(HttpStatusUser.NOT_FOUND.code)
  .send(new Response(HttpStatusUser.NOT_FOUND.code, HttpStatusUser.NOT_FOUND.status, 'Route does not exist on the server')));

socketio.on('connection', (socket) => {
  console.log('a user is connecting');
  socket.on('msg', (data) => {
    socket.emit('test', "en reponse, Coucou");
    console.log(data);   
  });
});
server.listen(PORT, () => console.log("Server is running on port " + server.address().address + " " + server.address().port))
