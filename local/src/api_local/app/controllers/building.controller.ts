import database from '../config/db_local.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import buildingCreateSchema, { buildingUpdateSchema } from '../models/building.model';
import HttpStatus, { getRelationToDelete, getEltToDelete } from '../util/devTools';
import Building from '../interfaces/building.interface';
import { sendToKafka } from '../config/kafka.config';

function setData(req: Request) {
  const data: Building = {
    name: req.body.name,
  };
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
  const test = await database.keys('buildings:*');
  if (test.length != 0) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'Local building already exists'));
  }
  const key = `buildings:${req.body.building_id}`;
  var data = setData(req);

  try {
    await database.hmset(key, data);
    sendToKafka('sendToMysql', "POST /building/ " + JSON.stringify(req.body))
    return res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Building with id ${req.body.building_id} created`, { id: req.body.building_id }));
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }

};

export const getBuildings = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching buildings`);
  try {
    const keys = await database.keys('buildings:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const buildings = await database.hgetall(key);
      const building_id = key.split("buildings:")[1];
      return { building_id, ...buildings };
    }));
    if (data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No buildings found`));
    }
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Buildings retrieved`, { buildings: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching building`);
  if (!(await database.exists(`buildings:${req.params.id}`))) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.params.id} was not found`));
  } else {
    try {
      const buildings = await database.hgetall(`buildings:${req.params.id}`);
      buildings.building_id = req.params.id;
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Building retrieved`, { buildings }));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`))
    }
  }
};

export const updateBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, updating building`);
  const { error } = buildingUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  if (!(await database.exists(`buildings:${req.params.id}`))) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.params.id} was not found`));
  } else {
    try {
      await database.hmset(`buildings:${req.params.id}`, req.body);
      sendToKafka('sendToMysql', `PUT /building/${req.params.id} ` + JSON.stringify(req.body))
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Building updated`, { id: req.params.id, ...req.body }));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    }
  }
};

export const deleteBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting building`);

  try {
    const buildingExists = await database.exists(`buildings:${req.params.id}`)
    if (!(buildingExists)) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.params.id} was not found`));
    }
    await getRelationToDelete("buildings:" + req.params.id)
    await getEltToDelete("floors", "buildings:" + req.params.id)
    sendToKafka('sendToMysql', `DELETE /building/${req.params.id} `)
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Building deleted`));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
