import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger.js';
import { Request, Response } from 'express';
import floorCreateSchema, { floorUpdateSchema } from '../models/floor.model';
import { v4 as uuidv4 } from 'uuid';
import { deleteRoom } from './room.controller.js';
import HttpStatus, { } from '../util/devTools';
import Floor from '../interfaces/floor.interface';

function setData(req: Request) {
  const data = {
    name: req.body.name,
    building_id: req.body.building_id,
  };
  return data;
}

export const createFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating floor`);
  const { error } = floorCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  const buildingIdsExist = await database.exists(`buildings:${req.body.building_id}`);
  if (!buildingIdsExist) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the building_id provided does not exist'));
    return;
  }
  if (!req.body.floor_id) {
    req.body.floor_id = `floors:${uuidv4()}`;
  } else {
    req.body.floor_id = `floors:${req.body.floor_id}`;
  }
  var data = setData(req);
  try {
    const result = await database.hmset(req.body.floor_id, data);
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Floor created`, { result }));
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
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floors retrieved`, { floors: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floor`);
  if (!(await database.exists(`floors:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'floor_id provided does not exist'));
    return;
  }
  try {
    const floors = await database.hgetall(`floors:${req.params.id}`);
    floors.floor_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor retrieved`, { floors }));
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id floors:${req.params.id} was not found`));
  }
};

export const updateFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floor`);
  const { error } = floorUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  if (!(await database.exists(`floors:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'floor_id provided does not exist'));
    return;
  }
  if (req.body.building_id && !(await database.exists(`buildings:${req.body.building_id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the building_id provided does not exist'));
    return;
  }
  try {
    await database.hmset(`floors:${req.params.id}`, req.body);
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Floor updated`));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

let hasError = false;

export const deleteFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting floor`);
  try {
    const floorExists = await database.exists(`floors:${req.params.id}`)
    if (!floorExists) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'floor_id provided does not exist'));
    }
    const roomsIds = await database.keys(`rooms:*`);
    const roomsToDelete: string[] = [];
    await Promise.all(roomsIds.map(async (id: string) => {
      const roomData = await database.hgetall(id);
      if (roomData.floor_id === req.params.id.toString()) {
        roomsToDelete.push(id);
      }
    }));
    // if (roomsToDelete.length > 0) {
    //   await Promise.all(roomsToDelete.map(async id => {
    //     id = id.split(":")[1];
    //     const roomRes = await deleteRoom({ params: { id: id }, method: "DELETE", originalUrl: `/room/${id}` });
    //     if (roomRes.statusCode !== HttpStatus.OK.code) {
    //       hasError = true;
    //       return;
    //     }
    //   }));
    // }
    if (!hasError) {
      await database.del(`floors:${req.params.id}`)
      if (res) {
        return res.status(HttpStatus.OK.code)
          .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor deleted`));
      } else {
        return {
          statusCode: HttpStatus.OK.code,
          message: `Floor deleted`
        };
      }
    }
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
