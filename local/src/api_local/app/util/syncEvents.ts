import { Server, Socket } from 'socket.io';
import logger from '../util/logger'
import { producer } from '../config/kafka.config'

export const syncEvents = (socketServer: Server) => {
    socketServer.on('connection', (socket: Socket) => {
        console.log('Nouvelle connexion WebSocket établie');

        // Gérez ici les événements de synchronisation
        socket.on('nouvelleDonneeRedis', async (data: any) => {
            try {
                await producer.connect();
                await producer.send({
                    topic: 'nouvelleDonneeRedis',
                    messages: [
                        {
                            key: 'some_key',
                            //value: JSON.stringify(data),
                            value: 'TEST'
                        },
                    ],
                });
                await producer.disconnect();
            } catch (error) {
                console.log(error)
            }
        });
    });

    return socketServer;
};
