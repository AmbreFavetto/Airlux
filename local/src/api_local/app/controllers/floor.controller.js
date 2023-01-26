import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; 
import floorCreateSchema, {floorUpdateSchema} from '../models/floor.model.js';
import {v4 as uuidv4} from 'uuid';
import { deleteRoom } from './room.controller.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

function setData(req) {
  const data = {
    name: req.body.name,
    building_id: req.body.building_id
  };
  return data;
}

export const createFloor = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating floor`);
  const { error } = floorCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  } 
  const buildingIdsExist = await database.exists(`buildings:${req.body.building_id}`);
  if (!buildingIdsExist) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the building_id provided does not exist'));
    return;
  } 
  const key = `floors:${uuidv4()}`; 
  var data = setData(req);
  try {
    const result = await database.hmset(key, data);
    res.status(HttpStatus.CREATED.code)
      .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Floor created`, { result }));
  } catch (err) {
    logger.error(err.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getFloors = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floors`);
  try {
    const keys = await database.keys('floors:*');
    let floors = await Promise.all(keys.map(async key => {
      const data = await database.hgetall(key);
      return { [key]: data };
    }));
    res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Floors retrieved`, { floors }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error));
  }
};

export const getFloor = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floor`);
  if (!(await database.exists(`floors:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'floor_id provided does not exist'));
    return;
  }  
  try {
    const result = await database.hgetall(`floors:${req.params.id}`);
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Floor retrieved`, { [`floors:${req.params.id}`]: result }));
  } catch(error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Floor by id floors:${req.params.id} was not found`));
  }   
};

export const updateFloor = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching floor`);
  const { error } = floorUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
      return;
  }
  if (!(await database.exists(`floors:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'floor_id provided does not exist'));
      return;
  } 
  if(req.body.building_id && !(await database.exists(`buildings:${req.body.building_id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the building_id provided does not exist'));
    return;
  }
  try{
    await database.hmset(`floors:${req.params.id}`, req.body);
    res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Floor updated`));
  } catch(error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  } 
};

let hasError = false;

export const deleteFloor = async(req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting floor`);
  try{
    const floorExists = await database.exists(`floors:${req.params.id}`)
    if (!floorExists) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'floor_id provided does not exist'));
    }
    const roomsIds = await database.keys(`rooms:*`);
    const roomsToDelete = [];
    await Promise.all(roomsIds.map(async id => {
      const roomData = await database.hgetall(id);
      if (roomData.floor_id === req.params.id.toString()) {
        roomsToDelete.push(id);
      }
    }));
    if(roomsToDelete.length > 0) {
      await Promise.all(roomsToDelete.map(async id => {
        id = id.split(":")[1];
        const roomRes = await deleteRoom({ params: { id: id }, method: "DELETE", originalUrl: `/room/${id}` });
        if (roomRes.statusCode !== HttpStatus.OK.code) {
          hasError = true;
          return;
        }
      }));      
    }
    if(!hasError) {
      await database.del(`floors:${req.params.id}`)
      if(res) {
        return res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Floor deleted`));
      } else{
        return {
        statusCode: HttpStatus.OK.code,
        message: `Floor deleted`
        };
      }
    }   
  } catch(error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
