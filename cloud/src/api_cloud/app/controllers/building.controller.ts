import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/building.query';
import buildingCreateSchema, { buildingUpdateSchema } from '../models/building.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import Building from '../interfaces/building.interface';

function setData(req: Request, id: string) {
  const data: Building = {
    name: req.body.name,
    building_id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: Building) {
  const data: Building = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues.name
  return data;
}

export const createBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating building`);
  // Validate body with model
  const { error } = buildingCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  // Create Building
  try {
    let id: string
    if (req.body.building_id) {
      id = req.body.building_id
    } else {
      id = uuidv4();
    }
    const data = setData(req, id);
    database.query(QUERY.CREATE_BUILDING, Object.values(data), () => {
      return res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Building with id ${id} created`, { id }));
    });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getBuildings = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching buildings`);
  try {
    const results: Array<Building> = await processDatas(QUERY.SELECT_BUILDINGS, database);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Buildings retrieved`, { buildings: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No buildings found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred ${err}`));
  }
};

export const getBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching building`);
  try {
    const results: Building = await processData(QUERY.SELECT_BUILDING, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Buildings retrieved`, { buildings: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`))
  }
};

export const updateBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, updating building`);
  const { error } = buildingUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const results: Building = await processData(QUERY.SELECT_BUILDING, req.params.id);
    const data = setUpdateData(req, results)
    database.query(QUERY.UPDATE_BUILDING, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Building updated`, { id: req.params.id, ...req.body }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting building`);
  try {
    await processData(QUERY.SELECT_BUILDING, req.params.id);
    database.query(QUERY.DELETE_BUILDING, req.params.id, () => {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Building deleted`));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
