import app from "./index";
import dotenv from 'dotenv';
import ip from 'ip';
import logger from './util/logger';
import http from 'http';
import { Server } from 'socket.io';
import { subscribeToKafkaTopic } from "./util/consumeKafka";

dotenv.config();

const server = http.createServer(app);
const io = new Server(server);
//const io = syncEvents(socketServer);

//io.connect();
io.on('connection', (socket) => {
    console.log('A client connected');
    // You can perform WebSocket-related actions here, e.g., send initial data to clients
});
subscribeToKafkaTopic('sendToMysql');

const start = (port: number) => {
    try {
        app.listen(port, () => logger.info(`Server running on: ${ip.address()}:${port}`));
    } catch (err) {
        process.exit();
    }
};

start(Number(process.env.SERVER_PORT));

export { io }