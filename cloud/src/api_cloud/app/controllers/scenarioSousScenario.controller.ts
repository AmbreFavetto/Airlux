import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import QUERY from '../query/scenarioSousScenario.query';
import scenarioSousScenarioCreateSchema from '../models/scenarioSousScenario.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import ScenarioSousScenario from '../interfaces/scenarioSousScenario.interface';

function setData(req: Request, id: string) {
  const data: ScenarioSousScenario = {
    scenario_id: req.body.scenario_id,
    sousScenario_id: req.body.sousScenario_id,
    id: id
  };
  return data;
}

export const createScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating scenarioSousScenario`);
  const { error } = scenarioSousScenarioCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    await processData(QUERY.SELECT_SCENARIO, req.body.scenario_id);
    await processData(QUERY.SELECT_SOUS_SCENARIO, req.body.sousScenario_id);
    let id: string
    if (req.body.id) {
      id = req.body.id
    } else {
      id = uuidv4();
    }
    const data = setData(req, id);
    database.query(QUERY.CREATE_SCENARIO_SOUS_SCENARIO, Object.values(data), () => {
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `scenarioSousScenario with id ${id} created`, { id }));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `scenario by id ${req.body.scenario_id} or sousScenario by id ${req.body.sousScenario_id} was not found`));
    }
    logger.info(err)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenariosSousScenarios = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenariosSousScenario`);
  try {
    const results: Array<ScenarioSousScenario> = await processDatas(QUERY.SELECT_SCENARIOS_SOUS_SCENARIOS, database);
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `scenariosSousScenario retrieved`, { scenariosSousScenarios: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No scenarioSousScenario found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarioSousScenario`);
  try {
    const results: ScenarioSousScenario = await processData(QUERY.SELECT_SCENARIO_SOUS_SCENARIO, req.params.id);
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `scenariosSousScenarios retrieved`, { scenariosSousScenarios: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `scenarioSousScenario by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting scenarioSousScenario`);
  try {
    await processData(QUERY.SELECT_SCENARIO_SOUS_SCENARIO, req.params.id);
    database.query(QUERY.DELETE_SCENARIO_SOUS_SCENARIO, req.params.id, () => {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `scenarioSousScenario deleted`));
    });
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
