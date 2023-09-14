import database from '../config/db_local.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import roomCreateSchema, { roomUpdateSchema } from '../models/room.model';
import HttpStatus, { getEltToDelete } from '../util/devTools';
import Room from '../interfaces/room.interface';

function setData(req: Request) {
  const data = {
    name: req.body.name,
    floor_id: req.body.floor_id
  };
  return data;
}

export const createRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating room`);
  const { error } = roomCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  const floorIdExist = await database.exists(`floors:${req.body.floor_id}`);
  if (!floorIdExist) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the floor_id provided does not exist'));
    return;
  }
  let key
  if (req.body.room_id) {
    key = `rooms:${req.body.room_id}`
  } else {
    key = `rooms:${uuidv4()}`;
  }
  var data = setData(req);
  try {
    const result = await database.hmset(key, data);
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Room created`, { result }));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getRooms = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching rooms`);
  try {
    const keys = await database.keys('rooms:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const rooms = await database.hgetall(key);
      const room_id = key.split("rooms:")[1];
      return { room_id, ...rooms };
    }));
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Rooms retrieved`, { rooms: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching room`);
  if (!(await database.exists(`rooms:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'room_id provided does not exist'));
    return;
  }
  try {
    const rooms = await database.hgetall(`rooms:${req.params.id}`);
    rooms.room_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room retrieved`, { rooms }));
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id rooms:${req.params.id} was not found`));
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching room`);
  const { error } = roomUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  if (!(await database.exists(`rooms:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'room_id provided does not exist'));
    return;
  }
  if (req.body.floor_id && !(await database.exists(`floors:${req.body.floor_id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the floor_id provided does not exist'));
    return;
  }
  try {
    await database.hmset(`rooms:${req.params.id}`, req.body);
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Room updated`));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting room`);
  try {
    const roomExists = await database.exists(`rooms:${req.params.id}`)
    if (!roomExists) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'room_id provided does not exist'));
    }
    await getEltToDelete("devices", "rooms:" + req.params.id)
    //await database.del(`rooms:${req.params.id}`)
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room deleted`));
  } catch (err) {
    if ((err as Error).message === "bad_request") {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, `bad request`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
