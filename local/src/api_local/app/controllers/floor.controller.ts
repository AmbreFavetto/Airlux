import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger.js';
import { Request, Response } from 'express';
import floorCreateSchema, { floorUpdateSchema } from '../models/floor.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { getEltToDelete } from '../util/devTools';
import Floor from '../interfaces/floor.interface';
import { sendToKafka } from '../config/kafka.config';

function setData(req: Request) {
  const data: Floor = {
    name: req.body.name,
    building_id: req.body.building_id,
  };
  return data;
}

export const createFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating floor`);
  // validate body with model
  const { error } = floorCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  // check if building_id exists
  const buildingIdsExist = await database.exists(`buildings:${req.body.building_id}`);
  if (!buildingIdsExist) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.body.building_id} was not found`));
    return;
  }
  if (!req.body.floor_id) {
    req.body.floor_id = uuidv4();
  }
  var data = setData(req);
  try {
    await database.hmset(`floors:${req.body.floor_id}`, data);
    sendToKafka('sendToMysql', "POST /floor/ " + JSON.stringify(data))
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Floor with id ${req.body.floor_id} created`, { id: req.body.floor_id }));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getFloors = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floors`);
  try {
    const keys = await database.keys('floors:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const floors = await database.hgetall(key);
      const floor_id = key.split("floors:")[1];
      return { floor_id, ...floors };
    }));
    if (data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Floors found`));
    }
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floors retrieved`, { floors: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floor`);
  if (!(await database.exists(`floors:${req.params.id}`))) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.params.id} was not found`));
    return;
  }
  try {
    const floors = await database.hgetall(`floors:${req.params.id}`);
    floors.floor_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor retrieved`, { floors }));
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, updating floor`);
  const { error } = floorUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  try {
    if (!(await database.exists(`floors:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.params.id} was not found`));
      return;
    }
    await database.hmset(`floors:${req.params.id}`, req.body);
    sendToKafka('sendToMysql', `PUT /floor/${req.params.id} ` + JSON.stringify(req.body))
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Floor updated`));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting floor`);
  try {
    const floorExists = await database.exists(`floors:${req.params.id}`)
    if (!floorExists) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.params.id}  was not found`));
    }
    await getEltToDelete("rooms", "floors:" + req.params.id)
    sendToKafka('sendToMysql', `DELETE /floor/${req.params.id} `)
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor deleted`));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `id was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
