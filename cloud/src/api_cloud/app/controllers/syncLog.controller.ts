import ResponseFormat from '../domain/responseFormat';
import { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';
import HttpStatus from '../util/devTools';

export const syncLog = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(req.body);
  return res.status(HttpStatus.OK.code)
    .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `ok`));
};