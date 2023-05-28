import express from 'express';
import dotenv from 'dotenv';
import ip from 'ip';
import cors from 'cors';

import routesBuilding from './routes/building.routes'
import routesDevice from './routes/device.routes'
import routesFloor from './routes/floor.routes'
import routesRoom from './routes/room.routes'
import routesUser from './routes/user.routes'
import routesScenario from './routes/scenario.routes'
import routesSousScenario from './routes/sousScenario.routes'
import routesScenarioSousScenario from './routes/scenarioSousScenario.routes'
import routesUserBuilding from './routes/userBuilding.routes'
import logger from './util/logger'

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
//UserBuilding
app.use('/user-building', routesUserBuilding);
//Scenario
app.use('/scenario', routesScenario);
//SousScenario
app.use('/sous-scenario', routesSousScenario);
//Scenario
app.use('/scenario-sous-scenario', routesScenarioSousScenario);

export default app;
