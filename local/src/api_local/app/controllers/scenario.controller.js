import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; 
import scenarioCreateSchema, {scenarioUpdateSchema} from '../models/scenario.model.js';
import {v4 as uuidv4} from 'uuid';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

function setData(req, device_id=null) {
  const data = {
    name: req.body.name,
  };
  device_id ? data.device_id = device_id : null;
  return data;
}

export const createScenario = async(req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating scenarios`);
  const { error } = scenarioCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  } 
  if(req.body.device_id){
    const deviceIdsExist = await Promise.all(req.body.device_id.map(async id => {
      return await database.exists(`devices:${id}`);
    }));
    if (!deviceIdsExist.every(exist => exist)) {
      res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'at least one of the device_id provided does not exist'));
      return;
    } 
    const uniqueDeviceIds = req.body.device_id.filter((item, index) => req.body.device_id.indexOf(item) === index);
    var data = setData(req, uniqueDeviceIds);
  } else {
    var data = setData(req);
  }
  try {
    const key = `scenarios:${uuidv4()}`; 
    const result = await database.hmset(key, data);
    res.status(HttpStatus.CREATED.code)
      .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario created`, { result }));
  } catch (err) {
    logger.error(err.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};


export const getScenarios = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarios`);
  try {
    const keys = await database.keys('scenarios:*');
    let scenarios = await Promise.all(keys.map(async key => {
      const data = await database.hgetall(key);
      return { [key]: data };
    }));
    res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenarios retrieved`, { scenarios }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error));
  }
};

export const getScenario = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  if (!(await database.exists(`scenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'scenario_id provided does not exist'));
    return;
  } 
  try {
    const result = await database.hgetall(`scenarios:${req.params.id}`);
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario retrieved`, { [`scenarios:${req.params.id}`]: result }));
  } catch(error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id scenarios:${req.params.id} was not found`));
  }
};

export const updateScenario = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  const { error } = scenarioUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  } 
  if (!(await database.exists(`scenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'scenario_id provided does not exist'));
    return;
  }
  if(req.body.device_id) {
    const deviceIdsExist = await Promise.all(req.body.device_id.map(async id => {
      return await database.exists(`devices:${id}`);
    }));
    if (!deviceIdsExist.every(exist => exist)) {
      res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the device_id provided does not exist'));
      return;
    }
    const uniqueDeviceIds = req.body.device_id.filter((item, index) => req.body.device_id.indexOf(item) === index);
    req.body.device_id = uniqueDeviceIds;
  }
  try{
    await database.hmset(`scenarios:${req.params.id}`, req.body);
    if(res) {
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario updated`));
    } else {
      return {
        statusCode: HttpStatus.OK.code,
        message: `Scenario updated`
      };
    }  
  } catch(error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  } 
};

export const deleteScenario = async(req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting scenario`);
  if (!(await database.exists(`scenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'scenario_id provided does not exist'));
    return;
  } 
  database.del(`scenarios:${req.params.id}`, (error, results) => {
    if (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      return;
    } 
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario deleted`, results[0]));
  });
};

export default HttpStatus;
