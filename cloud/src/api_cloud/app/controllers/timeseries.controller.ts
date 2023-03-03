import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/timeseries.query';
import timeseriesCreateSchema, { timeseriesUpdateSchema } from '../models/timeseries.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';

function setData(req: Request, id: string) {
  const data: Record<string, any> = {
    unit: req.body.unit,
    timestamp: req.body.timestamp,
    value: req.body.value,
    device_id: req.body.device_id,
    timeseries_id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: Array<any>) {
  const data: Record<string, any> = {};
  req.body.unit ? data.unit = req.body.unit : data.unit = previousValues[0].unit
  req.body.timestamp ? data.timestamp = req.body.timestamp : data.timestamp = previousValues[0].timestamp
  req.body.value ? data.value = req.body.value : data.value = previousValues[0].value
  req.body.device_id ? data.device_id = req.body.device_id : data.device_id = previousValues[0].device_id
  return data;
}

export const createTimeseries = (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating timeseries`);
  // Validate body with model
  const { error } = timeseriesCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const id = uuidv4();
    const data = setData(req, id);
    database.query(QUERY.CREATE_TIMESERIES, Object.values(data));
    return res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Timeseries created`));
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getTimeseriess = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching timeseriess`);
  try {
    const results: Array<any> = await processDatas(QUERY.SELECT_TIMESERIESS);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No timeseriess found`));
    } else {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Timerseriess retrieved`, { timeseriess: results }));
    }
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getTimeseries = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching timeseries`);
  try {
    const results: Array<any> = await processData(QUERY.SELECT_TIMESERIES, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Timeseries by id ${req.params.id} was not found`));
    } else {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseries retrieved`, { timeseries: results }));
    }
  } catch (err) {
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
    const results: Array<any> = await processData(QUERY.SELECT_TIMESERIES, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Timeseries by id ${req.params.id} was not found`));
    }
    const data = setUpdateData(req, results)
    database.query(QUERY.UPDATE_TIMESERIES, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseries updated`, { id: req.params.id, ...req.body }));
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteTimeseries = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting timeseries`);
  try {
    const results = await processData(QUERY.SELECT_TIMESERIES, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Timeseries by id ${req.params.id} was not found`));
    }
    database.query(QUERY.DELETE_TIMESERIES, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseries deleted`, results[0]));
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
