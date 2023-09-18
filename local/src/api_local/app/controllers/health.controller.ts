import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import HttpStatus from '../util/devTools';

export const health = async (req: Request, res: Response) => {
    try {
        return res.status(HttpStatus.OK.code)
            .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Access local-api_ok`));
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    }

};