import { Server, Socket } from 'socket.io';
import logger from '../util/logger'
//import { producer } from '../main';

export const syncEvents = (socketServer: Server) => {
    try {
        socketServer.on('nouvelleDonneeRedis', (socket: Socket) => {
            logger.info('Nouvelle connexion WebSocket établie');

            // Gérez ici les événements de synchronisation
            socket.on('nouvelleDonneeRedis', async (data: any) => {
                //     try {
                //         await producer.send({
                //             topic: 'nouvelleDonneeRedis',
                //             messages: [
                //                 {
                //                     key: 'some_key',
                //                     //value: JSON.stringify(data),
                //                     value: 'TEST'
                //                 },
                //             ],
                //         });
                //     } catch (error) {
                //         logger.error(`Erreur lors de l'envoi kafka : ` + error)
                //     }
            });
        });
    } catch (err) {
        logger.error(err)
    }


    return socketServer;
};
