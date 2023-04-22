import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger.js';
import scenarioCreateSchema, { scenarioUpdateSchema } from '../models/scenario.model.js';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { } from '../util/devTools';
import Scenario from '../interfaces/scenario.interface';

function setData(req: Request) {
  const data: Scenario = {
    name: req.body.name,
  };
  return data;
}

export const createScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating scenarios`);
  const { error } = scenarioCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  // if (req.body.device_id) {
  //   const deviceIdsExist = await Promise.all(req.body.device_id.map(async (id: string) => {
  //     return await database.exists(`devices:${id}`);
  //   }));
  //   if (!deviceIdsExist.every(exist => exist)) {
  //     res.status(HttpStatus.BAD_REQUEST.code)
  //       .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'at least one of the device_id provided does not exist'));
  //     return;
  //   }
  //   const uniqueDeviceIds: string[] | null = req.body.device_id.filter((item: string, index: number) => req.body.device_id.indexOf(item) === index);
  //   var data = setData(req, uniqueDeviceIds);
  // } else {
  //   var data = setData(req);
  // }
  try {
    var data = setData(req);
    const key = `scenarios:${uuidv4()}`;
    const result = await database.hmset(key, data);
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario created`, { result }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};


export const getScenarios = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarios`);
  try {
    const keys = await database.keys('scenarios:*');
    let scenarios = await Promise.all(keys.map(async (key: string) => {
      const data = await database.hgetall(key);
      return { [key]: data };
    }));
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenarios retrieved`, { scenarios }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  if (!(await database.exists(`scenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'scenario_id provided does not exist'));
    return;
  }
  try {
    const result = await database.hgetall(`scenarios:${req.params.id}`);
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario retrieved`, { [`scenarios:${req.params.id}`]: result }));
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id scenarios:${req.params.id} was not found`));
  }
};

export const updateScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  const { error } = scenarioUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  if (!(await database.exists(`scenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'scenario_id provided does not exist'));
    return;
  }
  if (req.body.device_id) {
    const deviceIdsExist = await Promise.all(req.body.device_id.map(async (id: string) => {
      return await database.exists(`devices:${id}`);
    }));
    if (!deviceIdsExist) {
      res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'the device_id provided does not exist'));
      return;
    }
    const uniqueDeviceIds = req.body.device_id.filter((item: string, index: number) => req.body.device_id.indexOf(item) === index);
    req.body.device_id = uniqueDeviceIds;
  }
  try {
    await database.hmset(`scenarios:${req.params.id}`, req.body);
    if (res) {
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario updated`));
    } else {
      return {
        statusCode: HttpStatus.OK.code,
        message: `Scenario updated`
      };
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting scenario`);
  if (!(await database.exists(`scenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'scenario_id provided does not exist'));
    return;
  }
  database.del(`scenarios:${req.params.id}`, (error: Error | null | undefined) => {
    if (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      return;
    }
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario deleted`));
  });
};

export default HttpStatus;
