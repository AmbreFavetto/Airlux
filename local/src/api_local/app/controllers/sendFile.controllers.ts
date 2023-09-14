import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import logger from '../util/logger'
import HttpStatus from '../util/devTools';

const logFile = 'sync.log';
const apiEndpoint = 'http://api_cloud:3010/syncLog';

export const sendFile = async (req: Request, res: Response) => {
    try {
        // Créer un objet FormData pour envoyer le fichier
        const formData = new FormData();
        const textFile = fs.readFileSync(logFile, { encoding: "utf-8" })
        logger.info("1")
        logger.info(textFile)
        const blob = new Blob([textFile])
        logger.info("2")
        logger.info(blob.text())
        //formData.append('logFile', 'sync.log')
        formData.append('sync.log', blob, logFile)
        logger.info(formData);

        // Envoyer le fichier à l'API distante en utilisant Axios
        const response = await axios.post(apiEndpoint, formData);
        logger.info(response)


        // if (response.status === 200) {
        //     return res.status(HttpStatus.OK.code)
        //         .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `File sent successfully`));
        // } else {
        //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        //         .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `File couldn't be sent`));
        // }
        return res.status(HttpStatus.OK.code)
            .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `File sent successfully`));
    } catch (error) {
        logger.error(error)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `File couldn't be sent`));
    }
}