import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger'; 
import QUERY from '../query/scenario.query';
import scenarioCreateSchema, {scenarioUpdateSchema} from '../models/scenario.model';
import {v4 as uuidv4} from 'uuid';
import HttpStatus, {processDatas, processData} from '../util/devTools';

function setData(req:Request, id:string) {
  const data:Record<string, any> = {
    name: req.body.name,
    scenario_id: id,
  };
  return data;
}

function setUpdateData(req:Request, previousValues:Array<any>) {
  const data:Record<string, any> = {};
  req.body.name? data.name = req.body.name : data.name = previousValues[0].name
  return data;
}

export const createScenario = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating scenario`);
  const {error} = scenarioCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    var results:Array<any> = await processData(QUERY.SELECT_DEVICE, (req.body.device_id))
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.body.device_id} was not found`));
    }
    const id = uuidv4();
    var data = setData(req, id);
    database.query(QUERY.CREATE_SCENARIO, Object.values(data));
    res.status(HttpStatus.CREATED.code)
          .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario created`));
  }  catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenarios = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarios`);
  try {
    var results:Array<any> = await processDatas(QUERY.SELECT_SCENARIOS)
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Scenarios found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenarios retrieved`, { scenarios: results }));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenario = async(req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  try {
    var results:Array<any> = await processData(QUERY.SELECT_SCENARIO, req.params.id);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario retrieved`, results[0]));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateScenario = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  const {error} = scenarioUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    if(req.body.device_id && (await processData(QUERY.SELECT_DEVICE, req.body.device_id)).length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
          .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device_id by id ${req.body.device_id} was not found`));
    }
    var results:Array<any> = await processData(QUERY.SELECT_SCENARIO, req.params.id)
    if(results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
    }
    var data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating scenario`);
    database.query(QUERY.UPDATE_SCENARIO, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario updated`, { id: req.params.id, ...req.body }));
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteScenario = async(req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting Scenario`);
  try {
    var results = await processData(QUERY.SELECT_SCENARIO, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
    } 
    database.query(QUERY.DELETE_SCENARIO, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario deleted`, results[0]));
  } catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
