import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import userCreateSchema, {userUpdateSchema} from '../models/user.model.js';
import {v4 as uuidv4} from 'uuid';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

function setData(req, building_id=null) {
  const data = {
    name: req.body.name,
    forename: req.body.forename,
    email: req.body.email,
    password: req.body.password,
  };
  building_id ? data.building_id = building_id : null;
  req.body.is_admin ? data.is_admin = req.body.is_admin : null;
  return data;
}

export const createUser = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating user`);
  const { error } = userCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  } 
  if(req.body.building_id){
    const buildingIdsExist = await Promise.all(req.body.building_id.map(async id => {
      return await database.exists(`buildings:${id}`);
    }));
    if (!buildingIdsExist.every(exist => exist)) {
      res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'at least one of the building_id provided does not exist'));
      return;
    } 
    const uniqueBuildingIds = req.body.building_id.filter((item, index) => req.body.building_id.indexOf(item) === index);
    var data = setData(req, uniqueBuildingIds);
  } else {
    var data = setData(req);
  }
  try {
    const key = `users:${uuidv4()}`; 
    const result = await database.hmset(key, data);
    res.status(HttpStatus.CREATED.code)
      .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User created`, { result }));
  } catch (err) {
    logger.error(err.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUsers = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching users`);
  try {
    const keys = await database.keys('users:*');
    let users = await Promise.all(keys.map(async key => {
      const data = await database.hgetall(key);
      return { [key]: data };
    }));
    res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Users retrieved`, { users }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error));
  }
};

export const getUser = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  if (!(await database.exists(`users:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'user_id provided does not exist'));
    return;
  } 
  try {
    const result = await database.hgetall(`users:${req.params.id}`);
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `User retrieved`, { [`users:${req.params.id}`]: result }));
  } catch(error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id users:${req.params.id} was not found`));
  }  
};

export const updateUser = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  } 
  if (!(await database.exists(`users:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'user_id provided does not exist'));
    return;
  }
  if(req.body.building_id) {
    const buildingIdsExist = await Promise.all(req.body.building_id.map(async id => {
      return await database.exists(`buildings:${id}`);
    }));
    if (!buildingIdsExist.every(exist => exist)) {
      res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the building_id provided does not exist'));
      return;
    }
    const uniqueBuildingIds = req.body.building_id.filter((item, index) => req.body.building_id.indexOf(item) === index);
    req.body.building_id = uniqueBuildingIds;
  }
  try{
    await database.hmset(`users:${req.params.id}`, req.body);
    if(res) {
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User updated`));
    } else {
      return {
        statusCode: HttpStatus.OK.code,
        message: `User updated`
      };
    }  
  } catch(error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  } 
};

export const deleteUser = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting user`);
  if (!(await database.exists(`users:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'user_id provided does not exist'));
    return;
  } 
  database.del(`users:${req.params.id}`, (error, results) => {
    if (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      return;
    } 
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `User deleted`, results[0]));
  });
};

export default HttpStatus;
