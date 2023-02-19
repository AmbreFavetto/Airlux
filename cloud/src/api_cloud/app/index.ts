import express from 'express';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';
import routesBuilding from './routes/building.routes';
import routesDevice from './routes/device.routes';
import routesScenarioDevice from './routes/scenario_device.routes';
import routesScenario from './routes/scenario.routes';
import routesFloor from './routes/floor.routes';
import routesRoom from './routes/room.routes';
import routesUser from './routes/user.routes';
import routesUserBuilding from './routes/user_building.routes';
import routesTimeseries from './routes/timeseries.routes';
import logger from './util/logger';


dotenv.config();
const PORT = 3000;
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

//Building
app.use('/building', routesBuilding);
//Device
app.use('/device/', routesDevice);
//ScenarioDevice
app.use('/scenario_device/', routesScenarioDevice);
//Scenario
app.use('/scenario/', routesScenario);
//Floor
app.use('/floor/', routesFloor);
//Room
app.use('/room/', routesRoom);
//User
app.use('/user/', routesUser);
//UserBuilding
app.use('/user_building/', routesUserBuilding);
//Timesries
app.use('/timeseries/', routesTimeseries);


app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));
