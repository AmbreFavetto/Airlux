import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import QUERY from '../query/floor.query';
import floorCreateSchema, {floorUpdateSchema} from '../models/floor.model';
import {v4 as uuidv4} from 'uuid';
import HttpStatus, {processDatas, processData} from '../util/devTools';

function setData(req:Request, id:string) {
  const data:Record<string, any> = {
    name: req.body.name,
    building_id: req.body.building_id,
    floor_id: id
  };
  return data;
}

function setUpdateData(req:Request, previousValues:Array<any>) {
  const data:Record<string, any> = {};
  req.body.name? data.name = req.body.name : data.name = previousValues[0].name
  req.body.building_id? data.building_id = req.body.building_id : data.building_id = previousValues[0].building_id
  return data;
}

export const createFloor = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating floor`);
  // validate body with model
  const {error} = floorCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
  // check if building_id exists
    var results:Array<any> = await processData(QUERY.SELECT_BUILDING, req.body.building_id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.body.building_id} was not found`));
    }
    const id = uuidv4();
    var data = setData(req, id);
    database.query(QUERY.CREATE_FLOOR, Object.values(data));
    res.status(HttpStatus.CREATED.code)
          .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Floor created`));
  }  catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getFloors = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floors`);
  try {
    var results:Array<any> = await processDatas(QUERY.SELECT_FLOORS);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Floors found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floors retrieved`, { floors: results }));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getFloor = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floor`);
  try {
    var results:Array<any> = await processData(QUERY.SELECT_FLOOR, req.params.id);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor retrieved`, results[0]));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateFloor = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floor`);
  const {error} = floorUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    if(req.body.building_id && (await processData(QUERY.SELECT_BUILDING, req.body.building_id)).length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
          .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building_id by id ${req.body.building_id} was not found`));
    }
    var results:Array<any> = await processData(QUERY.SELECT_FLOOR, req.params.id)
    if(results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.params.id} was not found`));
    }
    var data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating floor`);
    database.query(QUERY.UPDATE_FLOOR, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor updated`, { id: req.params.id, ...req.body }));
  } catch(err) {
    logger.info(err)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteFloor = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting floor`);
  try {
    var results = await processData(QUERY.SELECT_FLOOR, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id ${req.params.id} was not found`));
    } 
    database.query(QUERY.DELETE_FLOOR, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Floor deleted`, results[0]));
  } catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;