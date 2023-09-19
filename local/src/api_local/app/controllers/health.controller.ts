import ResponseFormat from '../domain/responseFormat';
import { Response, Request } from 'express';
import HttpStatus from '../util/devTools';

export const health = async (req: Request, res: Response) => {
    try {
        return res.status(HttpStatus.OK.code)
            .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Access local-api ok`));
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Access local-api nok`));
    }

};