import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import axios from 'axios';
import HttpStatus from '../util/devTools';

// Fonction pour vérifier la connectivité Internet
function checkInternetConnectivity(callback: any) {
    axios.get('http://www.google.com', { timeout: 5000 })
        .then(() => {
            callback(true);
        })
        .catch(() => {
            callback(false);
        });
}

export const health = async (req: Request, res: Response) => {
    checkInternetConnectivity((isConnectedToInternet: any) => {
        if (isConnectedToInternet) {
            return res.status(HttpStatus.OK.code)
                .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `API is connected to the Internet`));
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `API is not connected to the Internet`));
        }
    });
}