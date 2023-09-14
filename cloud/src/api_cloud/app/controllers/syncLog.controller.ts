import ResponseFormat from '../domain/responseFormat';
import { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';
import HttpStatus from '../util/devTools';

export const syncLog = async (req: Request, res: Response) => {
  try {
    // Vérifiez si un fichier a été téléchargé avec multer
    if (!req.body.file) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, `No file uploaded`));
    }

    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `File processed successfully`));
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `File processing failed`));
  }
};