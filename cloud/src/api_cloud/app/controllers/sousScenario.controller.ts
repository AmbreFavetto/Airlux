import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/sousScenario.query';
import sousScenarioCreateSchema from '../models/sousScenario.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import SousScenario from '../interfaces/sousScenario.interface';
import Device from '../interfaces/device.interface';

function setData(req: Request, id: string) {
  const data: SousScenario = {
    action: req.body.action,
    device_id: req.body.device_id,
    sousScenario_id: id,
  };
  return data;
}

const tabDeviceCategoryAction: Record<string, Array<string>> = {
  lamp: ["on", "off", "intensity"],
  lamp_rgb: ["on", "off", "intensity", "color"],
  blind: ["open", "close"],
  radiator: ["on", "off", "temperature"],
  air_conditioning: ["on", "off", "temperature"]
};

function verifyAction(category: string, action: string) {
  return tabDeviceCategoryAction[category].includes(action) ? true : false
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
    if (results.category) {
      if (!verifyAction(results.category, req.body.action)) {
        return res.status(HttpStatus.BAD_REQUEST.code)
          .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, `Action ${req.body.action} for device category ${results.category} is not available`));
      }
    }
    let id: string
    if (req.body.sousScenario_id) {
      id = req.body.sousScenario_id
    } else {
      id = uuidv4();
    }
    const data = setData(req, id);
    database.query(QUERY.CREATE_SOUS_SCENARIO, Object.values(data), () => {
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `sousScenario with id ${id} created`, { id }));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.body.device_id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getSousScenarios = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching sousScenarios`);
  try {
    const results: Array<SousScenario> = await processDatas(QUERY.SELECT_SOUS_SCENARIOS, database)
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `sousScenarios retrieved`, { sousScenarios: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No sousScenarios found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching sousScenario`);
  try {
    const results: SousScenario = await processData(QUERY.SELECT_SOUS_SCENARIO, req.params.id);
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `sousScenario retrieved`, { sousScenarios: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `sousScenario by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting sousScenario`);
  try {
    await processData(QUERY.SELECT_SOUS_SCENARIO, req.params.id);
    database.query(QUERY.DELETE_SOUS_SCENARIO, req.params.id, () => {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `sousScenario deleted`));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `sousScenario by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
