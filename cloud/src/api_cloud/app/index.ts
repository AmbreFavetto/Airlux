import express from 'express';
import cors from 'cors';
import routesBuilding from './routes/building.routes';
import routesDevice from './routes/device.routes';
import routesScenarioSousScenario from './routes/scenarioSousScenario.routes';
import routesScenario from './routes/scenario.routes';
import routesSousScenario from './routes/sousScenario.routes';
import routesFloor from './routes/floor.routes';
import routesRoom from './routes/room.routes';
import routesUser from './routes/user.routes';
import routesUserBuilding from './routes/userBuilding.routes';
import routesTimeseries from './routes/timeseries.routes';
import routesHealth from './routes/health.routes';
import routesSyncLog from './routes/syncLog.routes';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

//Health
app.use('/health', routesHealth);

//syncLog
app.use('/syncLog', routesSyncLog);

//Building
app.use('/building', routesBuilding);
//Device
app.use('/device/', routesDevice);
//ScenarioDevice
app.use('/scenario-sous-scenario/', routesScenarioSousScenario);
//Scenario
app.use('/scenario/', routesScenario);
//SousScenario
app.use('/sous-scenario/', routesSousScenario);
//Floor
app.use('/floor/', routesFloor);
//Room
app.use('/room/', routesRoom);
//User
app.use('/user/', routesUser);
//UserBuilding
app.use('/user-building/', routesUserBuilding);
//Timesries
app.use('/timeseries/', routesTimeseries);

export default app;