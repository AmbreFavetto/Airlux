import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat.js';
import logger from '../util/logger.js';
import { Request, Response } from 'express';
import scenarioSousScenarioCreateSchema, { scenarioSousScenarioUpdateSchema } from '../models/scenarioSousScenario.model.js';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { } from '../util/devTools.js';
import scenarioSousScenario from '../interfaces/scenarioSousScenario.interface'

function setData(req: Request) {
  const data: scenarioSousScenario = {
    scenario_id: req.body.scenario_id,
    sousScenario_id: req.body.sousScenario_id,
  };
  return data;
}

export const createScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating scenarioSousScenario`);
  const { error } = scenarioSousScenarioCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  try {
    var data = setData(req);
    let key
    if (req.body.id) {
      key = `scenariosSousScenarios:${req.body.id}`
    } else {
      key = `scenariosSousScenarios:${uuidv4()}`;
    }
    const result = await database.hmset(key, data);
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `ScenarioSousScenario created`, { result }));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenariosSousScenarios = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching ScenariosSousScenarios`);
  try {
    const keys = await database.keys('scenariosSousScenarios:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const scenariosSousScenarios = await database.hgetall(key);
      const scenarioSousScenario_id = key.split("scenariosSousScenarios:")[1];
      return { scenarioSousScenario_id, ...scenariosSousScenarios };
    }));
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `ScenariosSousScenarios retrieved`, { scenariosSousScenarios: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenariosSousScenarios`);
  if (!(await database.exists(`scenariosSousScenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'scenariosSousScenarios_id provided does not exist'));
    return;
  }
  try {
    const scenariosSousScenarios = await database.hgetall(`scenariosSousScenarios:${req.params.id}`);
    scenariosSousScenarios.scenarioSousScenario_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `ScenariosSousScenarios retrieved`, { scenariosSousScenarios }));
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `ScenariosSousScenarios by id scenariosSousScenarios:${req.params.id} was not found`));
  }
};

export const updateScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarioSousScenario`);
  const { error } = scenarioSousScenarioUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  if (!(await database.exists(`scenarioSousScenario:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'scenarioSousScenario_id provided does not exist'));
    return;
  }
  try {
    await database.hmset(`scenariosSousScenarios:${req.params.id}`, req.body);
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `ScenarioSousScenario updated`));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting ScenarioSousScenario`);
  if (!(await database.exists(`scenariosSousScenarios:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'scenarioSousScenario_id provided does not exist'));
    return;
  }
  database.del(`scenariosSousScenarios:${req.params.id}`, (error: Error | null | undefined) => {
    if (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      return;
    }
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `ScenarioSousScenario deleted`));
  });
};

export default HttpStatus;
