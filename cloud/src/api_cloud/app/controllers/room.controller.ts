import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import QUERY from '../query/room.query';
import roomCreateSchema, { roomUpdateSchema } from '../models/room.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';

function setData(req: Request, id: string) {
  const data: Record<string, any> = {
    name: req.body.name,
    floor_id: req.body.floor_id,
    room_id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: Array<any>) {
  const data: Record<string, any> = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues[0].name
  req.body.floor_id ? data.floor_id = req.body.floor_id : data.floor_id = previousValues[0].floor_id
  req.body.room_id ? data.room_id = req.body.room_id : data.room_id = previousValues[0].room_id
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
    const results: Array<any> = await processData(QUERY.SELECT_FLOOR, req.body.floor_id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.body.floor_id} was not found`));
    }
    const id = uuidv4();
    const data = setData(req, id);
    database.query(QUERY.CREATE_ROOM, Object.values(data));
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Room created`));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getRooms = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching rooms`);
  try {
    const results: Array<any> = await processDatas(QUERY.SELECT_ROOMS);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Rooms found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Rooms retrieved`, { rooms: results }));
    }
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching room`);
  try {
    const results: Array<any> = await processData(QUERY.SELECT_ROOM, req.params.id);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room retrieved`, results[0]));
    }
  } catch (err) {
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
    if (req.body.floor_id && (await processData(QUERY.SELECT_FLOOR, req.body.floor_id)).length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor_id by id ${req.body.floor_id} was not found`));
    }
    const results: Array<any> = await processData(QUERY.SELECT_ROOM, req.params.id)
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.params.id} was not found`));
    }
    const data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating room`);
    database.query(QUERY.UPDATE_ROOM, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room updated`, { id: req.params.id, ...req.body }));
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting room`);
  try {
    const results = await processData(QUERY.SELECT_ROOM, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.params.id} was not found`));
    }
    database.query(QUERY.DELETE_ROOM, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Room deleted`, results[0]));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
