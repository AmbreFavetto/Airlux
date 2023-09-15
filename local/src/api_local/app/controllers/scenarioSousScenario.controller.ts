import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat.js';
import logger from '../util/logger.js';
import { Request, Response } from 'express';
import scenarioSousScenarioCreateSchema from '../models/scenarioSousScenario.model.js';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { deleteElt } from '../util/devTools.js';
import scenarioSousScenario from '../interfaces/scenarioSousScenario.interface'
import { addLog } from '../util/logFile.js';

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
    const scenarioIdExist = await database.exists(`scenarios:${req.body.scenario_id}`);
    if (!scenarioIdExist) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.body.scenario_id} was not found`));
    }
    const sousScenarioIdExist = await database.exists(`sousScenarios:${req.body.sousScenario_id}`);
    if (!sousScenarioIdExist) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `SousScenario by id ${req.body.sousScenario_id} was not found`));
    }
    var data = setData(req);
    if (!req.body.id) {
      req.body.id = uuidv4();
    }
    await database.hmset(`scenariosSousScenarios:${req.body.id}`, data);
    if (req.headers.sync && req.headers.sync === "1") {
      addLog("POST", `/scenario-sous-scenario`, JSON.stringify(req.body))
    }
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `scenarioSousScenario with id ${req.body.id} created`, { id: req.body.id }));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenariosSousScenarios = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenariosSousScenarios`);
  try {
    const keys = await database.keys('scenariosSousScenarios:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const scenariosSousScenarios = await database.hgetall(key);
      const scenarioSousScenario_id = key.split("scenariosSousScenarios:")[1];
      return { scenarioSousScenario_id, ...scenariosSousScenarios };
    }));
    if (data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No ScenariosSousScenarios found`));
    }
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `ScenariosSousScenarios retrieved`, { scenariosSousScenarios: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenariosSousScenarios`);
  try {
    if (!(await database.exists(`scenariosSousScenarios:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `scenarioSousScenario by id ${req.params.id} was not found`));
      return;
    }
    const scenariosSousScenarios = await database.hgetall(`scenariosSousScenarios:${req.params.id}`);
    scenariosSousScenarios.scenarioSousScenario_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `ScenariosSousScenarios retrieved`, { scenariosSousScenarios }));
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `ScenariosSousScenarios by id scenariosSousScenarios:${req.params.id} was not found`));
  }
};

export const deleteScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting ScenarioSousScenario`);
  try {
    await deleteElt(req.params.id);
    if (req.headers.sync && req.headers.sync === "1") {
      addLog("DELETE", `/scenario-sous-scenario/${req.params.id}`, JSON.stringify(req.body))
    }
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `scenarioSousScenario deleted`));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `scenarioSousScenario by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
