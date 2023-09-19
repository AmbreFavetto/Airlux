import database from '../config/db_local.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import roomCreateSchema, { roomUpdateSchema } from '../models/room.model';
import HttpStatus, { getEltToDelete } from '../util/devTools';
import Room from '../interfaces/room.interface';
import { sendToKafka } from '../config/kafka.config';

function setData(req: Request) {
  const data: Room = {
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
  // check if floor_id exists
  try {
    const floorIdExist = await database.exists(`floors:${req.body.floor_id}`);
    if (!floorIdExist) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.body.floor_id} was not found`));
      return;
    }
    if (!req.body.room_id) {
      req.body.room_id = uuidv4();
    }
    var data = setData(req);

    await database.hmset(`rooms:${req.body.room_id}`, data);
    if (req.headers.sync && req.headers.sync === "1"){
      sendToKafka('sendToMysql', "POST /room/ " + JSON.stringify(req.body))
    }
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Room with id ${req.body.room_id} created`, { id: req.body.room_id }));
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
    if (data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Rooms found`));
    }
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Rooms retrieved`, { rooms: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching room`);
  try {
    if (!(await database.exists(`rooms:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.params.id} was not found`));
      return;
    }
    const rooms = await database.hgetall(`rooms:${req.params.id}`);
    rooms.room_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room retrieved`, { rooms }));
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, updating room`);
  const { error } = roomUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  try {
    if (!(await database.exists(`rooms:${req.params.id}`))) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.params.id} was not found`));
    }
    await database.hmset(`rooms:${req.params.id}`, req.body);
    if (req.headers.sync && req.headers.sync === "1"){
      sendToKafka('sendToMysql', `PUT /room/${req.params.id} ` + JSON.stringify(req.body))
    }
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Room updated`, { id: req.params.id, ...req.body }));
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
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.params.id} was not found`));
    }
    await getEltToDelete("devices", "rooms:" + req.params.id)
    if (req.headers.sync && req.headers.sync === "1"){
      sendToKafka('sendToMysql', `DELETE /room/${req.params.id} `)
    }
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room deleted`));
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
