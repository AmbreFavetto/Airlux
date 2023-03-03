import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import QUERY from '../query/scenarioSousScenario.query';
import scenarioSousScenarioCreateSchema, { scenarioSousScenarioUpdateSchema } from '../models/scenarioSousScenario.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';

function setData(req: Request, id: string) {
  const data: Record<string, any> = {
    scenario_id: req.body.scenario_id,
    dsous_scenario_id: req.body.sous_scenario_id,
    id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: Array<any>) {
  const data: Record<string, any> = {};
  req.body.scenario_id ? data.scenario_id = req.body.scenario_id : data.scenario_id = previousValues[0].scenario_id
  req.body.sous_scenario_id ? data.sous_scenario_id = req.body.sous_scenario_id : data.sous_scenario_id = previousValues[0].sous_scenario_id
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
    // check if scenario_id exists
    var results: Array<any> = await processData(QUERY.SELECT_SCENARIO, req.body.scenario_id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `scenario by id ${req.body.scenario_id} was not found`));
    }
    // check if sous_senario_id exists
    var results: Array<any> = await processData(QUERY.SELECT_SOUS_SCENARIO, req.body.sous_scenario_id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `sousScenario by id ${req.body.sous_scenario_id} was not found`));
    }
    const id = uuidv4();
    var data = setData(req, id);
    database.query(QUERY.CREATE_SCENARIO_SOUS_SCENARIO, Object.values(data));
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `scenarioSousScenario created`));
  } catch (err) {
    logger.info(err)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenariosSousScenarios = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenariosSousScenario`);
  try {
    var results: Array<any> = await processDatas(QUERY.SELECT_SCENARIOS_SOUS_SCENARIOS);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No scenarioSousScenario found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `scenariosSousScenario retrieved`, { scenarios_sous_scenarios: results }));
    }
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarioSousScenario`);
  try {
    var results: Array<any> = await processData(QUERY.SELECT_SCENARIO_SOUS_SCENARIO, req.params.id);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `scenario_sous_scenario by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `scenario_sous_scenario retrieved`, results[0]));
    }
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarioSousScenario`);
  const { error } = scenarioSousScenarioUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    if (req.body.scenario_id && (await processData(QUERY.SELECT_SCENARIO, req.body.scenario_id)).length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `scenario_id by id ${req.body.scenario_id} was not found`));
    }
    if (req.body.sous_scenario_id && (await processData(QUERY.SELECT_SOUS_SCENARIO, req.body.sous_scenario_id)).length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `sous_scenario_id by id ${req.body.sous_scenario_id} was not found`));
    }
    var results: Array<any> = await processData(QUERY.SELECT_SCENARIO_SOUS_SCENARIO, req.params.id)
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `scenarioSousScenario by id ${req.params.id} was not found`));
    }
    var data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating scenarioSousScenario`);
    database.query(QUERY.UPDATE_SCENARIO_SOUS_SCENARIO, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `scenarioSousScenario updated`, { id: req.params.id, ...req.body }));
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteScenarioSousScenario = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting scenarioSousScenario`);
  try {
    var results = await processData(QUERY.SELECT_SCENARIO_SOUS_SCENARIO, req.params.id);
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `scenarioSousScenario by id ${req.params.id} was not found`));
    }
    database.query(QUERY.DELETE_SCENARIO_SOUS_SCENARIO, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `scenarioSousScenario deleted`, results[0]));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
