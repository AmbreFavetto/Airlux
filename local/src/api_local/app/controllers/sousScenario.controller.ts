import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat.js';
import { Request, Response } from 'express';
import logger from '../util/logger.js';
import sousScenarioCreateSchema, { sousScenarioUpdateSchema } from '../models/sousScenario.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { deleteElt, getRelationToDelete } from '../util/devTools.js';
import SousScenario from '../interfaces/sousScenario.interface.js';

function setData(req: Request) {
  const data: SousScenario = {
    action: req.body.action,
    device_id: req.body.device_id
  };
  return data;
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
      res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the device_id provided does not exist'));
      return;
    }
    var data = setData(req);
    if (!req.body.sousScenario_id) {
      req.body.sousScenario_id = `sousScenarios:${uuidv4()}`;
    } else {
      req.body.sousScenario_id = `sousScenarios:${req.body.sousScenario_id}`;
    }
    const result = await database.hmset(req.body.sousScenario_id, data);
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `SousScenario created`, { result }));
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
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenarios retrieved`, { sousScenarios: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching sousScenario`);
  if (!(await database.exists(`sousScenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'sousScenario_id provided does not exist'));
    return;
  }
  try {
    const sousScenarios = await database.hgetall(`sousScenarios:${req.params.id}`);
    sousScenarios.sousScenario_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `SousScenario retrieved`, { sousScenarios }));
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `SousScenario by id sousScenarios:${req.params.id} was not found`));
  }
};

export const updateSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching sousScenario`);
  const { error } = sousScenarioUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  if (!(await database.exists(`sousScenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'sousScenario_id provided does not exist'));
    return;
  }
  if (req.body.device_id) {
    const deviceIdsExist = await Promise.all(req.body.device_id.map(async (id: string) => {
      return await database.exists(`devices:${id}`);
    }));
    if (!deviceIdsExist) {
      res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the device_id provided does not exist'));
      return;
    }
    const uniqueDeviceIds = req.body.device_id.filter((item: string, index: number) => req.body.device_id.indexOf(item) === index);
    req.body.device_id = uniqueDeviceIds;
  }
  try {
    await database.hmset(`sousScenarios:${req.params.id}`, req.body);
    if (res) {
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `SousScenario updated`));
    } else {
      return {
        statusCode: HttpStatus.OK.code,
        message: `SousScenario updated`
      };
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting sousScenario`);
  if (!(await database.exists(`sousScenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'sousScenario_id provided does not exist'));
    return;
  }
  await getRelationToDelete("sousScenarios:" + req.params.id)
  await deleteElt("sousScenarios:" + req.params.id)
  res.status(HttpStatus.OK.code)
    .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `SousScenario deleted`));
};

export default HttpStatus;
