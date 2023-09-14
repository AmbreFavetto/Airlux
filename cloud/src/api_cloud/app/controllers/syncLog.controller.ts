import ResponseFormat from '../domain/responseFormat';
import { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';
import HttpStatus from '../util/devTools';

const regex = /"message":"(POST|PUT|DELETE) ([^"]+) ({.*?})"/g;

export const syncLog = async (req: Request, res: Response) => {
  try {
    if (!req.body.file) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, `No file uploaded`));
    }
    const matches = [...req.body.file.matchAll(regex)];
    matches.forEach((match) => {
      const method = match[1];
      const route = match[2];
      const body = match[3];

      logger.info(`Méthode : ${method}`);
      logger.info(`Route : ${route}`);
      logger.info(`Body : ${body}`);
      logger.info('---');
    })

    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `File processed successfully`));
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `File processing failed`));
  }
};