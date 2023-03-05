import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/sousScenario.query';
import sousScenarioCreateSchema, { sousScenarioUpdateSchema } from '../models/sousScenario.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import SousScenario from '../interfaces/sousScenario.interface';
import Device from '../interfaces/device.interface';

function setData(req: Request, id: string) {
  const data: SousScenario = {
    action: req.body.action,
    device_id: req.body.device_id,
    sous_scenario_id: id,
  };
  return data;
}

function setUpdateData(req: Request, previousValues: SousScenario) {
  const data: SousScenario = {};
  req.body.action ? data.action = req.body.action : data.action = previousValues.action
  req.body.device_id ? data.device_id = req.body.device_id : data.device_id = previousValues.device_id
  return data;
}

const tabDeviceCategoryAction: Record<string, Array<string>> = {
  lamp: ["on", "off", "intensity"],
  lamp_rgb: ["on", "off", "intensity", "color"],
  pane: ["open", "close"],
  radiator: ["on", "off", "temperature"],
  air_conditioning: ["on", "off", "temperature"]
};

function verifyAction(category: string, action: string) {
  return action in tabDeviceCategoryAction[category] ? true : false
}

export const createSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating sousScenario`);
  const { error } = sousScenarioCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const results: Device = await processData(QUERY.SELECT_DEVICE, (req.body.device_id))
    if (!results) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.body.device_id} was not found`));
    }
    if (results.category) {
      if (!verifyAction(results.category, req.body.action)) {
        return res.status(HttpStatus.BAD_REQUEST.code)
          .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, `Action ${req.body.action} for device category ${results.category} is not available`));
      }
    }
    const id = uuidv4();
    const data = setData(req, id);
    database.query(QUERY.CREATE_SOUS_SCENARIO, Object.values(data));
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `sousScenario created`));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getSousScenarios = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching sousScenarios`);
  try {
    const results: Array<SousScenario> = await processDatas(QUERY.SELECT_SOUS_SCENARIOS)
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No sousScenarios found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `sousScenarios retrieved`, { sousScenarios: results }));
    }
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching sousScenario`);
  try {
    const results: SousScenario = await processData(QUERY.SELECT_SOUS_SCENARIO, req.params.id);
    if (!results) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `sousScenario by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `sousScenario retrieved`, results));
    }
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching sousScenario`);
  const { error } = sousScenarioUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    if (req.body.device_id && !await processData(QUERY.SELECT_DEVICE, req.body.device_id)) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `device_id by id ${req.body.device_id} was not found`));
    }
    const results: SousScenario = await processData(QUERY.SELECT_SOUS_SCENARIO, req.params.id)
    if (!results) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `sousScenario by id ${req.params.id} was not found`));
    }
    const data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating sousScenario`);
    database.query(QUERY.UPDATE_SOUS_SCENARIO, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `sousScenario updated`, { id: req.params.id, ...req.body }));
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting sousScenario`);
  try {
    const results: SousScenario = await processData(QUERY.SELECT_SOUS_SCENARIO, req.params.id);
    if (!results) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `sousScenario by id ${req.params.id} was not found`));
    }
    database.query(QUERY.DELETE_SOUS_SCENARIO, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `sousScenario deleted`, results));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
