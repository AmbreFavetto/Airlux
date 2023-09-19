import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat.js';
import { Request, Response } from 'express';
import logger from '../util/logger.js';
import sousScenarioCreateSchema, { sousScenarioUpdateSchema } from '../models/sousScenario.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { deleteElt, getRelationToDelete } from '../util/devTools.js';
import SousScenario from '../interfaces/sousScenario.interface.js';
import { addLog } from '../util/logFile.js';

function setData(req: Request) {
  const data: SousScenario = {
    action: req.body.action,
    device_id: req.body.device_id
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
  logger.info(`${req.method} ${req.originalUrl}, creating sousScenarios`);
  const { error } = sousScenarioCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  try {
    const deviceIdExist = await database.exists(`devices:${req.body.device_id}`);
    if (!deviceIdExist) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.body.device_id} was not found`));
      return;
    }
    const device = await database.hgetall(`devices:${req.params.id}`);
    if (device.category) {
      if (!verifyAction(device.category, req.body.action)) {
        return res.status(HttpStatus.BAD_REQUEST.code)
          .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, `Action ${req.body.action} for device category ${device.category} is not available`));
      }
    }
    var data = setData(req);

    if (!req.body.sousScenario_id) {
      req.body.sousScenario_id = uuidv4();
    }
    await database.hmset(`sousScenarios:${req.body.sousScenario_id}`, data);
    if (req.headers.sync && req.headers.sync && req.headers.sync === "1") {
      addLog("POST", `/sous-scenario`, JSON.stringify(req.body))
    }
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `sousScenario with id ${req.body.sousScenario_id} created`, { id: req.body.sousScenario_id }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getSousScenarios = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching sousScenarios`);
  try {
    const keys = await database.keys('sousScenarios:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const sousScenarios = await database.hgetall(key);
      const sousScenario_id = key.split("sousScenarios:")[1];
      return { sousScenario_id, ...sousScenarios };
    }));
    if (data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No SousScenarios found`));
    }
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenarios retrieved`, { sousScenarios: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching sousScenario`);
  try {
    if (!(await database.exists(`sousScenarios:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `sousScenario by id ${req.params.id} was not found`));
      return;
    }
    const sousScenarios = await database.hgetall(`sousScenarios:${req.params.id}`);
    sousScenarios.sousScenario_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `SousScenario retrieved`, { sousScenarios }));
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting sousScenario`);
  try {
    if (!(await database.exists(`sousScenarios:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `sousScenario by id ${req.params.id} was not found`));
      return;
    }
    await getRelationToDelete("sousScenarios:" + req.params.id)
    await deleteElt("sousScenarios:" + req.params.id)
    if (req.headers.sync && req.headers.sync && req.headers.sync === "1") {
      addLog("DELETE", `/sous-scenario/${req.params.id}`, JSON.stringify(req.body))
    }
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `SousScenario deleted`));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `id was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
