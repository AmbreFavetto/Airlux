import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import QUERY from '../query/scenario_device.query';
import scenarioDeviceCreateSchema, {scenarioDeviceUpdateSchema} from '../models/scenario_device.model';
import {v4 as uuidv4} from 'uuid';
import HttpStatus, {processDatas, processData} from '../util/devTools';

function setData(req:Request, id:string) {
  const data:Record<string, any> = {
    scenario_id: req.body.scenario_id,
    device_id: req.body.device_id,
    id: id
  };
  return data;
}

function setUpdateData(req:Request, previousValues:Array<any>) {
  const data:Record<string, any> = {};
  req.body.scenario_id ? data.scenario_id = req.body.scenario_id : data.scenario_id = previousValues[0].scenario_id
  req.body.device_id? data.device_id = req.body.device_id : data.device_id = previousValues[0].device_id
  return data;
}

export const createScenarioDevice = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating scenario_device`);
  const {error} = scenarioDeviceCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    // check if scenario_id exists
    var results:Array<any> = await processData(QUERY.SELECT_SCENARIO, req.body.scenario_id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.body.scenario_id} was not found`));
    }
    // check if device_id exists
    var results:Array<any> = await processData(QUERY.SELECT_DEVICE, req.body.device_id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.body.device_id} was not found`));
    }
    const id = uuidv4();
    var data = setData(req, id);
    database.query(QUERY.CREATE_SCENARIO_DEVICE, Object.values(data));
    res.status(HttpStatus.CREATED.code)
          .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario_device created`));
  }  catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenariosDevices = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarios_devices`);
  try {
    var results:Array<any> = await processDatas(QUERY.SELECT_SCENARIOS_DEVICES);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Scenario_device found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenarios_devices retrieved`, { scenarios_devices: results }));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenarioDevice = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario_device`);
  try {
    var results:Array<any> = await processData(QUERY.SELECT_SCENARIO_DEVICE, req.params.id);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario_device by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario_device retrieved`, results[0]));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateScenarioDevice = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario_device`);
  const {error} = scenarioDeviceUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    if(req.body.scenario_id && (await processData(QUERY.SELECT_SCENARIO, req.body.scenario_id)).length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
          .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario_id by id ${req.body.scenario_id} was not found`));
    }
    if(req.body.device_id && (await processData(QUERY.SELECT_DEVICE, req.body.device_id)).length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
          .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device_id by id ${req.body.device_id} was not found`));
    }
    var results:Array<any> = await processData(QUERY.SELECT_SCENARIO_DEVICE, req.params.id)
    if(results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario_device by id ${req.params.id} was not found`));
    }
    var data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating scenario_device`);
    database.query(QUERY.UPDATE_SCENARIO_DEVICE, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario_device updated`, { id: req.params.id, ...req.body }));
  } catch(error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteScenarioDevice = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting ScenarioDevice`);
  try {
    var results = await processData(QUERY.SELECT_SCENARIO_DEVICE, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario_device by id ${req.params.id} was not found`));
    } 
    database.query(QUERY.DELETE_SCENARIO_DEVICE, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario_device deleted`, results[0]));
  } catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
