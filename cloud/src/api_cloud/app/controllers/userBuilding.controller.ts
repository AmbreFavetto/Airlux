import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/userBuilding.query';
import userBuildingCreateSchema, { userBuildingUpdateSchema } from '../models/userBuilding.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import UserBuilding from '@/interfaces/userBuilding.interface';
import { sendToKafka } from '../config/kafka.config';

function setData(req: Request, id: string) {
  const data: UserBuilding = {
    user_id: req.body.user_id,
    building_id: req.body.building_id,
    id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: UserBuilding) {
  const data: UserBuilding = {};
  req.body.user_id ? data.user_id = req.body.user_id : data.user_id = previousValues.user_id
  req.body.building_id ? data.building_id = req.body.building_id : data.building_id = previousValues.building_id
  return data;
}

export const createUserBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating userBuilding`);
  const { error } = userBuildingCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    await processData(QUERY.SELECT_USER, req.body.user_id);
    await processData(QUERY.SELECT_BUILDING, req.body.building_id);
    let id: string
    if (req.body.id) {
      id = req.body.id
    } else {
      id = uuidv4();
    }
    const data = setData(req, id);
    database.query(QUERY.CREATE_USER_BUILDING, Object.values(data), () => {
      sendToKafka('sendToRedis', "POST /user-building/ " + JSON.stringify(req.body))
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `userBuilding with id ${id} created`, { id }));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status,
          `user by id ${req.body.user_id} or building by id ${req.body.building_id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUsersBuildings = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching usersBuildings`);
  try {
    const results: Array<UserBuilding> = await processDatas(QUERY.SELECT_USERS_BUILDINGS, database);
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `usersBuildings retrieved`, { usersBuildings: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No usersBuildings found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUserBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching userBuilding`);
  try {
    const results: UserBuilding = await processData(QUERY.SELECT_USER_BUILDING, req.params.id);
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `userBuilding retrieved`, { usersBuildings: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `userBuilding by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
}

export const deleteUserBuilding = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting userBuilding`);
  try {
    await processData(QUERY.SELECT_USER_BUILDING, req.params.id);
    database.query(QUERY.DELETE_USER_BUILDING, req.params.id, () => {
      sendToKafka('sendToRedis', `DELETE /user-building/${req.params.id} `)
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `userBuilding deleted`));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User_building by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
