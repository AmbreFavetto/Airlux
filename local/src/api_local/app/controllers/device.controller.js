import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import {v4 as uuidv4} from 'uuid';
import deviceCreateSchema, {deviceUpdateSchema} from '../models/device.model.js';

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
    type: req.body.type,
    room_id: req.body.room_id
  };
  return data;
}

export const createDevice = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating device`);
  const { error } = deviceCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  } 
  const roomIdExist = await database.exists(`rooms:${req.body.room_id}`);
  if (!roomIdExist) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the room_id provided does not exist'));
    return;
  } 
  const key = `devices:${uuidv4()}`; 
  var data = setData(req);
  try {
    const result = await database.hmset(key, data);
    res.status(HttpStatus.CREATED.code)
      .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Device created`, { result }));
  } catch (err) {
    logger.error(err.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getDevices = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching devices`);
  try {
    const keys = await database.keys('devices:*');
    let devices = await Promise.all(keys.map(async key => {
      const data = await database.hgetall(key);
      return { [key]: data };
    }));
    res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Devices retrieved`, { devices }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error));
  }
};

export const getDevice = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching device`);
  if (!(await database.exists(`devices:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'device_id provided does not exist'));
    return;
  }  
  try {
    const result = await database.hgetall(`devices:${req.params.id}`);
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Device retrieved`, { [`devices:${req.params.id}`]: result }));
  } catch(error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id devices:${req.params.id} was not found`));
  } 
};

export const updateDevice = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching device`);
  const { error } = deviceUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
      return;
  }
  if (!(await database.exists(`devices:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'device_id provided does not exist'));
      return;
  } 
  if(req.body.room_id && !(await database.exists(`rooms:${req.body.room_id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the room_id provided does not exist'));
    return;
  }
  try{
    await database.hmset(`devices:${req.params.id}`, req.body);
    res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Device updated`));
  } catch(error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  } 
};

let hasError = false;

export const deleteDevice = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting Device`);
  try{
    const deviceExists = await database.exists(`devices:${req.params.id}`)
    if (!deviceExists) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'device_id provided does not exist'));
    }
    let scenariosIds = await database.keys('scenarios:*');
    await Promise.all(scenariosIds.map(async id => {
      const scenarioData = await database.hgetall(id);
      let scenarioDataUpdate = scenarioData.device_id.split(",");
      if(scenarioDataUpdate.indexOf(req.params.id) != -1) {
        scenarioDataUpdate.splice(scenarioDataUpdate.indexOf(req.params.id), 1);
        id = id.split(":")[1];
        const scenarioRes = await updateScenario({params: {id: id}, body: {device_id: scenarioDataUpdate}, method: "UPDATE", originalUrl: `/scenario/${id}`})
        if (scenarioRes.statusCode !== HttpStatus.OK.code) {
          hasError = true;
          return;
        }
      }
    }));   
    if(!hasError){
      await database.del(`devices:${req.params.id}`)
      if(res) {
        return res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Device deleted`));
      } else{
        return {
        statusCode: HttpStatus.OK.code,
        message: `Device deleted`
        };
      }
    }  
  } catch(error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
