import express from 'express';
import dotenv from 'dotenv';
import ip from 'ip';
import cors from 'cors';
import socketIO from 'socket.io';

import routesBuilding from './routes/building.routes.js';
import routesDevice from './routes/device.routes.js';
import routesFloor from './routes/floor.routes.js';
import routesRoom from './routes/room.routes.js';
import routesUser from './routes/user.routes.js';
import routesScenario from './routes/scenario.routes.js'
import logger from './util/logger.js';

dotenv.config();
const PORT = 3000;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

//Building
app.use('/building', routesBuilding);
// Device
app.use('/device', routesDevice);
//Floor
app.use('/floor', routesFloor);
//Room
app.use('/room', routesRoom);
//User
app.use('/user', routesUser);
//Scenario
app.use('/scenario', routesScenario);

const server = app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));
const io = socketIO(server);

//Building
io.use('/building', routesBuilding);
// Device
io.use('/device', routesDevice);
//Floor
io.use('/floor', routesFloor);
//Room
io.use('/room', routesRoom);
//User
io.use('/user', routesUser);
//Scenario
io.use('/scenario', routesScenario);