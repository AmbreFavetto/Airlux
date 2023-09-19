import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger.js';
import scenarioCreateSchema, { scenarioUpdateSchema } from '../models/scenario.model.js';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { deleteElt, getRelationToDelete } from '../util/devTools';
import Scenario from '../interfaces/scenario.interface';
import { addLog } from '../util/logFile.js';
import { sendToKafka } from '../config/kafka.config';

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
  try {
    var data = setData(req);

    if (!req.body.scenario_id) {
      req.body.scenario_id = uuidv4();
    }
    await database.hmset(`scenarios:${req.body.scenario_id}`, data);
    if (req.headers.sync && req.headers.sync === "1"){
      sendToKafka('sendToMysql', "POST /scenario/ " + JSON.stringify(req.body))
    }
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario with id ${req.body.scenario_id} created`, { id: req.body.scenario_id }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};


export const getScenarios = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarios`);
  try {
    const keys = await database.keys('scenarios:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const scenarios = await database.hgetall(key);
      const scenario_id = key.split("scenarios:")[1];
      return { scenario_id, ...scenarios };
    }));
    if (data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Scenarios found`));
    }
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenarios retrieved`, { scenarios: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  try {
    if (!(await database.exists(`scenarios:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
      return;
    }
    const scenarios = await database.hgetall(`scenarios:${req.params.id}`);
    scenarios.scenario_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario retrieved`, { scenarios }));
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, updating scenario`);
  const { error } = scenarioUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  try {
    if (!(await database.exists(`scenarios:${req.params.id}`))) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
    }
    await database.hmset(`scenarios:${req.params.id}`, req.body);
    if (req.headers.sync && req.headers.sync && req.headers.sync === "1") {
      addLog("PUT", `/scenario/${req.params.id}`, JSON.stringify(req.body))
    }
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario updated`, { id: req.params.id, ...req.body }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting scenario`);
  try {
    if (!(await database.exists(`scenarios:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
      return;
    }
    await getRelationToDelete("scenarios:" + req.params.id)
    await deleteElt("scenarios:" + req.params.id)
    if (req.headers.sync && req.headers.sync && req.headers.sync === "1") {
      addLog("DELETE", `/scenario/${req.params.id}`, JSON.stringify(req.body))
    }
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario deleted`));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `id was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
