import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/device.query';
import deviceCreateSchema, { deviceUpdateSchema } from '../models/device.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import Device from '../interfaces/device.interface';
import Room from '../interfaces/room.interface';

const listActuator = ["lamp", "lamp_rgb", "pane", "radiator", "air_conditioning"]
//const listCaptor = ["humidity", "temperature", "pressure"]

function setData(req: Request, id: string, typeToAdd: string) {
  const data: Device = {
    name: req.body.name,
    room_id: req.body.room_id,
    type: typeToAdd,
    category: req.body.category,
    device_id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: Array<Device>, typeToAdd: string) {
  const data: Device = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues[0].name
  req.body.room_id ? data.room_id = req.body.room_id : data.room_id = previousValues[0].room_id
  data.type = typeToAdd
  req.body.category ? data.category = req.body.category : data.category = previousValues[0].category
  return data;
}

export const createDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating device`);
  const { error } = deviceCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const results: Room = await processData<Room>(QUERY.SELECT_ROOM, (req.body.room_id))
    if (!results) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.body.room_id} was not found`));
    }
    const id = uuidv4();
    let type = ""
    if (req.body.category in listActuator) {
      type = "actuator"
    } else {
      type = "captor"
    }
    const data = setData(req, id, type);
    database.query(QUERY.CREATE_DEVICE, Object.values(data));
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Device created`));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getDevices = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching devices`);
  try {
    const results: Array<Device> = await processDatas(QUERY.SELECT_DEVICES, database)
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Devices found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Devices retrieved`, { devices: results }));
    }
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching device`);
  try {
    const results: Device = await processData(QUERY.SELECT_DEVICE, req.params.id);
    if (!results) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Device retrieved`, results));
    }
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching device`);
  const { error } = deviceUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    if (req.body.room_id && !(await processData(QUERY.SELECT_ROOM, req.body.room_id))) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room_id by id ${req.body.room_id} was not found`));
    }
    const results: Array<Device> = await processData(QUERY.SELECT_DEVICE, req.params.id)
    if (results.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
    }
    let type = ""
    if (req.body.category in listActuator) {
      type = "actuator"
    } else {
      type = "captor"
    }
    const data = setUpdateData(req, results, type);
    logger.info(`${req.method} ${req.originalUrl}, updating device`);
    database.query(QUERY.UPDATE_DEVICE, [...Object.values(data), req.params.id]);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Device updated`, { id: req.params.id, ...req.body }));
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting Device`);
  try {
    const results: Device = await processData(QUERY.SELECT_DEVICE, req.params.id);
    if (!results) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
    }
    database.query(QUERY.DELETE_DEVICE, req.params.id);
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Device deleted`, results));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
