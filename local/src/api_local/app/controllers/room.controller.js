import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; 
import {v4 as uuidv4} from 'uuid';
import roomCreateSchema, {roomUpdateSchema} from '../models/room.model.js';
import { deleteDevice } from './device.controller.js';

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
    floor_id: req.body.floor_id
  };
  return data;
}

export const createRoom = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating room`);
  const { error } = roomCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  } 
  const floorIdExist = await database.exists(`floors:${req.body.floor_id}`);
  if (!floorIdExist) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the floor_id provided does not exist'));
    return;
  } 
  const key = `rooms:${uuidv4()}`; 
  var data = setData(req);
  try {
    const result = await database.hmset(key, data);
    res.status(HttpStatus.CREATED.code)
      .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Room created`, { result }));
  } catch (err) {
    logger.error(err.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getRooms = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching rooms`);
  try {
    const keys = await database.keys('rooms:*');
    let rooms = await Promise.all(keys.map(async key => {
      const data = await database.hgetall(key);
      return { [key]: data };
    }));
    res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Rooms retrieved`, { rooms }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error));
  }
};

export const getRoom = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching room`);
  if (!(await database.exists(`rooms:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'room_id provided does not exist'));
    return;
  }  
  try {
    const result = await database.hgetall(`rooms:${req.params.id}`);
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Room retrieved`, { [`rooms:${req.params.id}`]: result }));
  } catch(error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id rooms:${req.params.id} was not found`));
  } 
};

export const updateRoom = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching room`);
  const { error } = roomUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
      return;
  }
  if (!(await database.exists(`rooms:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'room_id provided does not exist'));
      return;
  } 
  if(req.body.floor_id && !(await database.exists(`floors:${req.body.floor_id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the floor_id provided does not exist'));
    return;
  }
  try{
    await database.hmset(`rooms:${req.params.id}`, req.body);
    res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Room updated`));
  } catch(error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  } 
};

let hasError = false;

export const deleteRoom = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting room`);
  try{
    const roomExists = await database.exists(`rooms:${req.params.id}`)
    if (!roomExists) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'room_id provided does not exist'));
    }
    const devicesIds = await database.keys(`devices:*`);
    const devicesToDelete = [];
    await Promise.all(devicesIds.map(async id => {
      const deviceData = await database.hgetall(id);
      if (deviceData.room_id === req.params.id.toString()) {
        devicesToDelete.push(id);
      }
    }));
    if(devicesToDelete.length > 0) {
      await Promise.all(devicesToDelete.map(async id => {
        id = id.split(":")[1];
        const deviceRes = await deleteDevice({ params: { id: id }, method: "DELETE", originalUrl: `/device/${id}` });
        if (deviceRes.statusCode !== HttpStatus.OK.code) {
          hasError = true;
          return;
        }
      }));      
    }
    if(!hasError) {
      await database.del(`rooms:${req.params.id}`)
      if(res) {
        return res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Room deleted`));
      } else{
        return {
        statusCode: HttpStatus.OK.code,
        message: `Room deleted`
        };
      }
    }
  } catch(error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
