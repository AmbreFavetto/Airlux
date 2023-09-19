import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger.js';
import { Request, Response } from 'express';
import userBuildingCreateSchema from '../models/userBuilding.model.js';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { deleteElt } from '../util/devTools';
import UserBuilding from '../interfaces/userBuilding.interface.js';
import { sendToKafka } from '../config/kafka.config';

function setData(req: Request) {
  const data: UserBuilding = {
    user_id: req.body.user_id,
    building_id: req.body.building_id,
  };
  return data;
}

export const createUserBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating userBuilding`);
  const { error } = userBuildingCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  try {
    const userIdExist = await database.exists(`users:${req.body.user_id}`);
    if (!userIdExist) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.body.user_id} was not found`));
    }
    const buildingIdExist = await database.exists(`buildings:${req.body.building_id}`);
    if (!buildingIdExist) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.body.building_id} was not found`));
    }
    var data = setData(req);
    if (!req.body.id) {
      req.body.id = uuidv4();
    }
    await database.hmset(`usersBuildings:${req.body.id}`, data);
    if (req.headers.sync && req.headers.sync === "1"){
      sendToKafka('sendToMysql', "POST /user-building/ " + JSON.stringify(req.body))
    }
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `userBuilding with id ${req.body.id} created`, { id: req.body.id }));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUsersBuildings = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching usersBuildings`);
  try {
    const keys = await database.keys('usersBuildings:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const usersBuildings = await database.hgetall(key);
      const userBuilding_id = key.split("usersBuildings:")[1];
      return { userBuilding_id, ...usersBuildings };
    }));
    if (data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No UsersBuildings found`));
    }
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `UsersBuildings retrieved`, { usersBuildings: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUserBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching userBuilding`);
  try {
    if (!(await database.exists(`usersBuildings:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `userBuilding by id ${req.params.id} was not found`));
      return;
    }
    const usersBuildings = await database.hgetall(`usersBuildings:${req.params.id}`);
    usersBuildings.userBuilding_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `UserBuilding retrieved`, { usersBuildings }));
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteUserBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting userBuilding`);
  try {
    await deleteElt(req.params.id);
    if (req.headers.sync && req.headers.sync === "1"){
      sendToKafka('sendToMysql', `DELETE /user-building/${req.params.id} `)
    }
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `userBuilding deleted`));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `userBuilding by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
