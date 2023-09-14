import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger.js';
import { Request, Response } from 'express';
import userBuildingCreateSchema, { userBuildingUpdateSchema } from '../models/userBuilding.model.js';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { } from '../util/devTools';
import UserBuilding from '../interfaces/userBuilding.interface.js';

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
    var data = setData(req);
    let key
    if (req.body.id) {
      key = `usersBuildings:${req.body.id}`
    } else {
      key = `usersBuildings:${uuidv4()}`;
    }
    const result = await database.hmset(key, data);
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `UserBuilding created`, { result }));
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
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `UsersBuildings retrieved`, { usersBuildings: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUserBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching userBuilding`);
  if (!(await database.exists(`usersBuildings:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'userBuilding_id provided does not exist'));
    return;
  }
  try {
    const usersBuildings = await database.hgetall(`usersBuildings:${req.params.id}`);
    usersBuildings.userBuilding_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `UserBuilding retrieved`, { usersBuildings }));
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `UserBuilding by id usersBuildings:${req.params.id} was not found`));
  }
};

export const updateUserBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching userBuilding`);
  const { error } = userBuildingUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  if (!(await database.exists(`usersBuildings:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'userBuilding_id provided does not exist'));
    return;
  }
  try {
    await database.hmset(`usersBuildings:${req.params.id}`, req.body);
    if (res) {
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `UserBuilding updated`));
    } else {
      return {
        statusCode: HttpStatus.OK.code,
        message: `UserBuilding updated`
      };
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteUserBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting userBuilding`);
  if (!(await database.exists(`usersBuildings:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'userBuilding_id provided does not exist'));
    return;
  }
  database.del(`usersBuildings:${req.params.id}`, (error: Error | null | undefined) => {
    if (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      return;
    }
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `UserBuilding deleted`));
  });
};

export default HttpStatus;
