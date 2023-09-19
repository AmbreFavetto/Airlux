import app from "./index";
import dotenv from 'dotenv';
import ip from 'ip';
import logger from './util/logger';
import http from 'http';
import { Server } from 'socket.io';
import { syncEvents } from './util/syncEvents'

dotenv.config();

const server = http.createServer(app);
const socketServer = new Server(server);

syncEvents(socketServer);

const start = (port: number) => {
    try {
        app.listen(port, () => logger.info(`Server running on: ${ip.address()}:${port}`));
    } catch (err) {
        process.exit();
    }
};

start(Number(process.env.SERVER_PORT));
export { socketServer };