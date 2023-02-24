import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/user.query';
import userCreateSchema, {userUpdateSchema} from '../models/user.model';
import {v4 as uuidv4} from 'uuid';
import HttpStatus, {processDatas, processData} from '../util/devTools';

function setData(req:Request, id:string) {
  const data:Record<string, any> = {
    name: req.body.name,
    forename: req.body.forename,
    email: req.body.email,
    password: req.body.password,
    is_admin: req.body.is_admin,
    user_id: id
  };
  return data;
}

function setUpdateData(req:Request, previousValues:Array<any>) {
  const data:Record<string, any> = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues[0].name
  req.body.forename? data.forename = req.body.forename : data.forename = previousValues[0].forename
  req.body.email? data.email = req.body.email : data.email = previousValues[0].email
  req.body.password? data.password = req.body.password : data.password = previousValues[0].password
  req.body.is_admin? data.is_admin = req.body.is_admin : data.is_admin = previousValues[0].is_admin
  return data;
}

export const createUser = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating user`);
  const {error} = userCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const id = uuidv4();
    var data = setData(req, id);
    database.query(QUERY.CREATE_USER, Object.values(data));
    res.status(HttpStatus.CREATED.code)
          .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User created`));
  }  catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUsers = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching users`);
  try {
    var results:Array<any> = await processDatas(QUERY.SELECT_USERS);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No users found`));
    } else {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Users retrieved`, { users: results }));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUser = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  try {
    var results:Array<any> = await processData(QUERY.SELECT_USER, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    } else {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Users retrieved`, { users: results }));
    }
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`))
  }
};

export const updateUser = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  const {error} = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    var results:Array<any> = await processData(QUERY.SELECT_USER, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    } 
    var data = setUpdateData(req, results)
    database.query(QUERY.UPDATE_USER, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User updated`, { id: req.params.id, ...req.body }));
  } catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteUser = async (req:Request, res:Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting user`);
  try {
    var results = await processData(QUERY.SELECT_USER, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    } 
    database.query(QUERY.DELETE_USER, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User deleted`, results[0]));
  } catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;