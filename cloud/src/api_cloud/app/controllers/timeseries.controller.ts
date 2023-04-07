import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/timeseries.query';
import timeseriesCreateSchema, { timeseriesUpdateSchema } from '../models/timeseries.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import Timeseries from '../interfaces/timeseries.interface';

function setData(req: Request, id: string) {
  const data: Timeseries = {
    unit: req.body.unit,
    timestamp: req.body.timestamp,
    value: req.body.value,
    device_id: req.body.device_id,
    timeseries_id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: Timeseries) {
  const data: Timeseries = {};
  req.body.unit ? data.unit = req.body.unit : data.unit = previousValues.unit
  req.body.timestamp ? data.timestamp = req.body.timestamp : data.timestamp = previousValues.timestamp
  req.body.value ? data.value = req.body.value : data.value = previousValues.value
  req.body.device_id ? data.device_id = req.body.device_id : data.device_id = previousValues.device_id
  return data;
}

export const createTimeseries = (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating timeseries`);
  const { error } = timeseriesCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const id = uuidv4();
    const data = setData(req, id);
    database.query(QUERY.CREATE_TIMESERIES, Object.values(data), (err: Error | null, results: any) => {
      return res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Timeseries created`));
    });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getTimeseriess = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching timeseriess`);
  try {
    const results: Array<Timeseries> = await processDatas(QUERY.SELECT_TIMESERIESS, database);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Timerseriess retrieved`, { timeseriess: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No timeseriess found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getTimeseries = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching timeseries`);
  try {
    const results: Timeseries = await processData(QUERY.SELECT_TIMESERIES, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseries retrieved`, { timeseriess: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Timeseries by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`))
  }
};

export const updateTimeseries = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching timeseries`);
  const { error } = timeseriesUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const results: Timeseries = await processData(QUERY.SELECT_TIMESERIES, req.params.id);
    const data = setUpdateData(req, results)
    database.query(QUERY.UPDATE_TIMESERIES, [...Object.values(data), req.params.id], (err: Error | null, results: any) => {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseries updated`, { id: req.params.id, ...req.body }));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Timeseries by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteTimeseries = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting timeseries`);
  try {
    await processData(QUERY.SELECT_TIMESERIES, req.params.id);
    database.query(QUERY.DELETE_TIMESERIES, req.params.id, (err: Error | null, results: any) => {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseries deleted`));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Timeseries by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
