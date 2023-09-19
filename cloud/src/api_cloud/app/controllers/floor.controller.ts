import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import QUERY from '../query/floor.query';
import floorCreateSchema, { floorUpdateSchema } from '../models/floor.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import Floor from '../interfaces/floor.interface';
import { sendToKafka } from '../config/kafka.config';

function setData(req: Request, id: string) {
  const data: Floor = {
    name: req.body.name,
    building_id: req.body.building_id,
    floor_id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: Floor) {
  const data: Floor = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues.name
  return data;
}

export const createFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating floor`);
  // validate body with model
  const { error } = floorCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    // check if building_id exists
    await processData(QUERY.SELECT_BUILDING, req.body.building_id);
    let id: string
    if (req.body.floor_id) {
      id = req.body.floor_id
    } else {
      id = uuidv4();
    }
    const data = setData(req, id);
    database.query(QUERY.CREATE_FLOOR, Object.values(data), () => {
      return res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Floor with id ${id} created`, { id }));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.body.building_id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getFloors = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floors`);
  try {
    const results: Array<Floor> = await processDatas(QUERY.SELECT_FLOORS, database);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floors retrieved`, { floors: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Floors found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floor`);
  try {
    const results: Floor = await processData(QUERY.SELECT_FLOOR, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor retrieved`, { floors: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, updating floor`);
  const { error } = floorUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const results: Floor = await processData(QUERY.SELECT_FLOOR, req.params.id)
    const data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating floor`);
    database.query(QUERY.UPDATE_FLOOR, [...Object.values(data), req.params.id], () => {
      if (req.headers.sync && req.headers.sync === "1"){
        sendToKafka('sendToRedis', `PUT /floor/${req.params.id} ` + JSON.stringify(req.body))
      }
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor updated`, { id: req.params.id, ...req.body }));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteFloor = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting floor`);
  try {
    await processData(QUERY.SELECT_FLOOR, req.params.id);
    database.query(QUERY.DELETE_FLOOR, req.params.id, () => {
      if (req.headers.sync && req.headers.sync === "1"){
        sendToKafka('sendToRedis', `DELETE /floor/${req.params.id} `)
      }
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor deleted`));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
