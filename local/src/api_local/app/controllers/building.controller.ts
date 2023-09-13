import dbLocal from '../config/db_local.config';
import dbCloud from '../config/db_cloud.config.js';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import buildingCreateSchema, { buildingUpdateSchema } from '../models/building.model';
import HttpStatus, { getRelationToDelete, getEltToDelete } from '../util/devTools';
import Building from '../interfaces/building.interface';
import winston from "../config/winston.config";

function setData(req: Request) {
  const data: Building = {
    name: req.body.name,
  };
  return data;
}

export const createBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating building`);
  const { error } = buildingCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  } else {
    const test = await dbLocal.keys('buildings:*');
    logger.error(test)
    if (test.length != 0) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'Local building already exists'));
    }
    const key = `buildings:${req.body.building_id}`;
    var data = setData(req);
    try {
      await dbLocal.hmset(key, data);
      winston.log('info', `POST createBuilding {name:${req.body.name}, building_id:${req.body.building_id}}`);
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Building created`));
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    }
  }
};

export const getBuildings = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching buildings`);
  try {
    const keys = await dbLocal.keys('buildings:*');
    let buildings = await Promise.all(keys.map(async (key: string) => {
      const data = await dbLocal.hgetall(key);
      return { [key]: data };
    }));
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Buildings retrieved`, { buildings }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching building`);
  if (!(await dbLocal.exists(`buildings:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'building_id provided does not exist'));
  } else {
    try {
      const result = await dbLocal.hgetall(`buildings:${req.params.id}`);
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Building retrieved`, { [`buildings:${req.params.id}`]: result }));
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id buildings:${req.params.id} was not found`));
    }
  }
};

export const updateBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching building`);
  const { error } = buildingUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  } else {
    if (!(await dbLocal.exists(`buildings:${req.params.id}`))) {
      res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'building_id provided does not exist'));
    } else {
      try {
        await dbLocal.hmset(`buildings:${req.params.id}`, req.body);
        res.status(HttpStatus.CREATED.code)
          .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Building updated`));
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      }
    }
  }
};

export const deleteBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting building`);

  try {
    const buildingExists = await dbLocal.exists(`buildings:${req.params.id}`)
    if (!(buildingExists)) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'building_id provided does not exist'));
    }
    await getRelationToDelete("buildings:" + req.params.id)
    await getEltToDelete("floors", "buildings:" + req.params.id)
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Building deleted`));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
