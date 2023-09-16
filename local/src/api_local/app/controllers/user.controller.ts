import database from '../config/db_local.config.js';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger.js';
import { Request, Response } from 'express';
import userCreateSchema, { userUpdateSchema, userLoginSchema } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { deleteElt, getRelationToDelete } from '../util/devTools';
import User from '../interfaces/user.interface';
import { addLog } from '../util/logFile.js';
import jwt from 'jsonwebtoken';
import argon2 from "argon2";

async function setData(req: Request) {
  const data: User = {
    name: req.body.name,
    forename: req.body.forename,
    email: req.body.email,
    password: await argon2.hash(req.body.password),
    user_id: req.body.user_id
  };
  req.body.is_admin ? data.is_admin = req.body.is_admin : null;
  return data;
}

export const createUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating user`);
  const { error } = userCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const keys = await database.keys('users:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const users = await database.hgetall(key);
      return users;
    }));

    for (const user of data) {
      if (user.email === req.body.email) {
        // email already exist
        return res.status(HttpStatus.BAD_REQUEST.code)
          .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, `User with email ${req.body.email} already exists`));
      }
    }

    if (!req.body.user_id) {
      req.body.user_id = uuidv4();
    }
    const dataUser = await setData(req);

    const secretKey = process.env.SECRET_KEY || "secret_key"
    if (dataUser.email && dataUser.password) {
      const token = jwt.sign({
        email: dataUser.email,
        isadmin: dataUser.is_admin
      }, secretKey, { expiresIn: '3 hours' })

      await database.hmset(`users:${req.body.user_id}`, dataUser);
      if (req.headers.sync && req.headers.sync === "1") {
        addLog("POST", `/user`, JSON.stringify(req.body))
      }
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User with id ${req.body.user_id} created`, { id: req.body.user_id, token: token }));
    }

  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const login = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const secretKey = process.env.SECRET_KEY || "secret_key"
    const keys = await database.keys('users:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const users = await database.hgetall(key);
      return users;
    }));
    let password;
    let isadmin;
    let user_id;
    for (const user of data) {
      logger.info(user)
      if (user.email === req.body.email) {
        password = user.password
        isadmin = user.isadmin
        user_id = user.user_id
      }
    }
    if (!password) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by email ${req.body.email} was not found`));
    }
    if (await argon2.verify(password, req.body.password)) {
      // Générez un token JWT
      const token = jwt.sign({
        email: req.body.email,
        isadmin: isadmin
      }, secretKey, { expiresIn: '3 hours' })
      logger.info(user_id)
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Login succes`, { token, user_id }));
    } else {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Password given for the ${req.body.email} email is wrong`));
    }
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
}

export const getUsers = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching users`);
  try {
    const keys = await database.keys('users:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const users = await database.hgetall(key);
      const user_id = key.split("users:")[1];
      return { user_id, ...users };
    }));
    if (data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Users found`));
    }
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Users retrieved`, { users: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  try {
    if (!(await database.exists(`users:${req.params.id}`))) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));

    }
    const users = await database.hgetall(`users:${req.params.id}`);
    users.user_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User retrieved`, { users }));
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`))
  }
};

export const updateUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  try {
    if (!(await database.exists(`users:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
      return;
    }
    await database.hmset(`users:${req.params.id}`, req.body);
    if (req.headers.sync && req.headers.sync === "1") {
      addLog("PUT", `/user/${req.params.id}`, JSON.stringify(req.body))
    }
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User updated`));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting user`);
  try {
    if (!(await database.exists(`users:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
      return;
    }
    await getRelationToDelete("users:" + req.params.id)
    await deleteElt("users:" + req.params.id)
    if (req.headers.sync && req.headers.sync === "1") {
      addLog("DELETE", `/user/${req.params.id}`, JSON.stringify(req.body))
    }
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User deleted`));
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
