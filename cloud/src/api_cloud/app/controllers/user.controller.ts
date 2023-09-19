import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/user.query';
import userCreateSchema, { userUpdateSchema, userLoginSchema } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import User from '../interfaces/user.interface'
import jwt from 'jsonwebtoken';
import argon2 from "argon2";
import { sendToKafka } from '../config/kafka.config';

async function setData(req: Request, id: string) {
  const data: User = {
    name: req.body.name,
    forename: req.body.forename,
    email: req.body.email,
    password: await argon2.hash(req.body.password),
  };
  req.body.is_admin != null ? data.is_admin = req.body.is_admin : data.is_admin = true
  data.user_id = id
  return data;
}

function setUpdateData(req: Request, previousValues: User) {
  const data: User = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues.name
  req.body.forename ? data.forename = req.body.forename : data.forename = previousValues.forename
  req.body.email ? data.email = req.body.email : data.email = previousValues.email
  req.body.password ? data.password = req.body.password : data.password = previousValues.password
  req.body.is_admin ? data.is_admin = req.body.is_admin : data.is_admin = previousValues.is_admin
  return data;
}

async function processEmail<User>(query: string, id: string): Promise<User> {
  return new Promise((resolve, reject) => {
    database.query(query, id, (error: Error | null, results: User[]) => {
      if (error) {
        return reject(error);
      }
      if (results.length != 0) {
        return reject(new Error('already_exists'));
      }
      resolve(results[0]);
    });
  });
}

export const createUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating user`);
  const { error } = userCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    await processEmail(QUERY.SELECT_USER_BY_EMAIL, req.body.email);

    let id: string
    if (req.body.user_id) {
      id = req.body.user_id
    } else {
      id = uuidv4();
    }
    const data = await setData(req, id);
    const secretKey = process.env.SECRET_KEY || "secret_key"
    if (data.email && data.password) {
      const token = jwt.sign({
        id: data.user_id,
        email: data.email,
        isadmin: data.is_admin
      }, secretKey, { expiresIn: '3 hours' })
      database.query(QUERY.CREATE_USER, Object.values(data), () => {
        sendToKafka('sendToRedis', "POST /user/ " + JSON.stringify(req.body))
        res.status(HttpStatus.CREATED.code)
          .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User with id ${id} created`, { id, token }));
      });
    }
  } catch (err) {
    if ((err as Error).message === "already_exists") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by email ${req.body.email} already exists`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const login = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, login`);
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }

  try {
    const result: User = await processData(QUERY.SELECT_USER_BY_EMAIL, req.body.email);
    const secretKey = process.env.SECRET_KEY || "secret_key"
    if (result.password && await argon2.verify(result.password, req.body.password!)) {
      // Générez un token JWT
      const token = jwt.sign({
        email: req.body.email,
        isadmin: result.is_admin
      }, secretKey, { expiresIn: '3 hours' })

      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Login succes`, { token, user_id: result.user_id }));
    } else {
      res.status(401)
        .send(new ResponseFormat(401, "Unauthorized", "Authentication failed"));
    }

  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by email ${req.body.email} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
}

export const getUsers = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching users`);
  try {
    const results: Array<User> = await processDatas(QUERY.SELECT_USERS, database);
    for (const user of results) {
      delete user.password
    }
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Users retrieved`, { users: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No users found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  try {
    const results: User = await processData(QUERY.SELECT_USER, req.params.id);
    delete results.password
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Users retrieved`, { users: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`))
  }
};

export const updateUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const results: User = await processData(QUERY.SELECT_USER, req.params.id);
    const data = setUpdateData(req, results)
    database.query(QUERY.UPDATE_USER, [...Object.values(data), req.params.id], () => {
      sendToKafka('sendToRedis', `PUT /user/${req.params.id} ` + JSON.stringify(req.body))
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User updated`, { id: req.params.id, ...req.body }));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting user`);
  try {
    await processData(QUERY.SELECT_USER, req.params.id);
    database.query(QUERY.DELETE_USER, req.params.id, () => {
      sendToKafka('sendToRedis', `DELETE /user/${req.params.id} `)
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User deleted`));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
