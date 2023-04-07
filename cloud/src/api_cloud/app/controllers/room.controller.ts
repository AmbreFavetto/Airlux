import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import QUERY from '../query/room.query';
import roomCreateSchema, { roomUpdateSchema } from '../models/room.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import Room from '../interfaces/room.interface';

function setData(req: Request, id: string) {
  const data: Room = {
    name: req.body.name,
    floor_id: req.body.floor_id,
    room_id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: Room) {
  const data: Room = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues.name
  req.body.floor_id ? data.floor_id = req.body.floor_id : data.floor_id = previousValues.floor_id
  req.body.room_id ? data.room_id = req.body.room_id : data.room_id = previousValues.room_id
  return data;
}

export const createRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating room`);
  const { error } = roomCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    // check if floor_id exists
    await processData(QUERY.SELECT_FLOOR, req.body.floor_id);
    const id = uuidv4();
    const data = setData(req, id);
    database.query(QUERY.CREATE_ROOM, Object.values(data));
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Room created`));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.body.floor_id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getRooms = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching rooms`);
  try {
    const results: Array<Room> = await processDatas(QUERY.SELECT_ROOMS, database);
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Rooms retrieved`, { rooms: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Rooms found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching room`);
  try {
    const results: Room = await processData(QUERY.SELECT_ROOM, req.params.id);
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room retrieved`, { rooms: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching room`);
  const { error } = roomUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    if (req.body.floor_id) {
      await processData(QUERY.SELECT_FLOOR, req.body.floor_id)
    }
    const results: Room = await processData(QUERY.SELECT_ROOM, req.params.id)
    const data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating room`);
    database.query(QUERY.UPDATE_ROOM, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room updated`, { id: req.params.id, ...req.body }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.params.id} was not found or Floor_id by id ${req.body.floor_id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting room`);
  try {
    await processData(QUERY.SELECT_ROOM, req.params.id);
    database.query(QUERY.DELETE_ROOM, req.params.id, (err: Error | null, results: any) => {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room deleted`));
    });

  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
