import ResponseFormat from '../domain/responseFormat';
import { Response } from 'express';
import HttpStatus from '../util/devTools';

export const health = async (res: Response) => {
    return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Access local-api_ok`));
};