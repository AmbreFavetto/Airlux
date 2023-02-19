import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger'; 
import QUERY from '../query/user_building.query';
import userBuildingCreateSchema, {userBuildingUpdateSchema} from '../models/user_building.model';
import {v4 as uuidv4} from 'uuid';
import HttpStatus, {processDatas, processData} from '../util/devTools';

function setData(req:Request, id:string) {
  const data:Record<string, any> = {
    user_id: req.body.user_id,
    building_id: req.body.building_id,
    id: id
  };
  return data;
}

function setUpdateData(req:Request, previousValues:Array<any>) {
  const data:Record<string, any> = {};
  req.body.user_id ? data.user_id = req.body.user_id : data.user_id = previousValues[0].user_id
  req.body.building_id? data.building_id = req.body.building_id : data.building_id = previousValues[0].building_id
  return data;
}

export const createUserBuilding = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating user_building`);
  const {error} = userBuildingCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    // check if user_id exists
    var results:Array<any> = await processData(QUERY.SELECT_USER, req.body.user_id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.body.user_id} was not found`));
    }
    // check if building_id exists
    var results:Array<any> = await processData(QUERY.SELECT_BUILDING, req.body.building_id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.body.building_id} was not found`));
    }
    const id = uuidv4();
    var data = setData(req, id);
    database.query(QUERY.CREATE_USER_BUILDING, Object.values(data));
    res.status(HttpStatus.CREATED.code)
          .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User_building created`));
  }  catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUsersBuildings = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching users_buildings`);
  try {
    var results:Array<any> = await processDatas(QUERY.SELECT_USERS_BUILDINGS);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Users_buildings found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Users_buildings retrieved`, { users_buildings: results }));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUserBuilding = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user_building`);
  try {
    var results:Array<any> = await processData(QUERY.SELECT_USER_BUILDING, req.params.id);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User_building by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User_building retrieved`, results[0]));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
}

export const updateUserBuilding = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user_building`);
  const {error} = userBuildingUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    if(req.body.scenario_id && (await processData(QUERY.SELECT_USER, req.body.scenario_id)).length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
          .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User_id by id ${req.body.user_id} was not found`));
    }
    if(req.body.device_id && (await processData(QUERY.SELECT_BUILDING, req.body.device_id)).length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
          .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building_id by id ${req.body.building_id} was not found`));
    }
    var results:Array<any> = await processData(QUERY.SELECT_USER_BUILDING, req.params.id)
    if(results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User_building by id ${req.params.id} was not found`));
    }
    var data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating user_building`);
    database.query(QUERY.UPDATE_USER_BUILDING, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User_building updated`, { id: req.params.id, ...req.body }));
  } catch(error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteUserBuilding = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting user_building`);
  try {
    var results = await processData(QUERY.SELECT_USER_BUILDING, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User_building by id ${req.params.id} was not found`));
    } 
    database.query(QUERY.DELETE_USER_BUILDING, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User_building deleted`, results[0]));
  } catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
