import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response } from 'express';
import logger from '../util/logger';
import QUERY from '../query/device.query';
import deviceCreateSchema, { deviceUpdateSchema } from '../models/device.model';
import { v4 as uuidv4 } from 'uuid';
import HttpStatus, { processDatas, processData } from '../util/devTools';
import Device from '../interfaces/device.interface';

const listActuator = ["lamp", "lamp_rgb", "blind", "radiator", "air_conditioning"]

function setData(req: Request, id: string) {
  const data: Device = {
    name: req.body.name,
    room_id: req.body.room_id,
    type: req.body.type,
    category: req.body.category,
    value: req.body.value,
    device_id: id
  };
  return data;
}

function setUpdateData(req: Request, previousValues: Device) {
  const data: Device = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues.name
  req.body.value ? data.value = req.body.value : data.value = previousValues.value
  return data;
}

function matchRegex(value: string, category: string) {
  const listCategoryRegex: Record<string, string> =
  {
    "lamp": "^(0|1),(0|[1-9][0-9]?|100)$",
    "lamp_rgb": "^(0|1),(0|[1-9][0-9]?|100),(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
    "blind": "^(0|1)$",
    "radiator": "^(0|1)$",
    "air_conditioning": "^(0|1)$",
    "humidity": "^(0.0)", // définir bornes précises
    "temperature": "^(0.0)", // définir bornes précises
    "pressure": "^(0.0)" // définir bornes précises
  }

  if (value.match(listCategoryRegex[category]) === null) {
    return false
  } else {
    return true
  }

}

function setDefaultValue(category: string) {
  const listDefaultValues: Record<string, string> =
  {
    "lamp": "(0,0)",
    "lamp_rgb": "(0,0,(255,255,255))",
    "blind": "(0)",
    "radiator": "(0)",
    "air_conditioning": "(0)",
    "humidity": "(0.0)",
    "temperature": "(0.0)",
    "pressure": "(0.0)"
  }

  return listDefaultValues[category]
}

export const createDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating device`);
  const { error } = deviceCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    await processData(QUERY.SELECT_ROOM, (req.body.room_id))
    const id = uuidv4();
    if (listActuator.includes(req.body.category)) {
      req.body.type = "actuator"
    } else {
      req.body.type = "sensor"
    }
    const result = setDefaultValue(req.body.category)
    req.body.value = result
    const data = setData(req, id);
    database.query(QUERY.CREATE_DEVICE, Object.values(data), () => {
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Device created`));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.body.room_id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getDevices = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching devices`);
  try {
    const results: Array<Device> = await processDatas(QUERY.SELECT_DEVICES, database)
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Devices retrieved`, { devices: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Devices found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching device`);
  try {
    const results: Device = await processData(QUERY.SELECT_DEVICE, req.params.id);
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Device retrieved`, { devices: results }));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
    }
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
    const results: Device = await processData(QUERY.SELECT_DEVICE, req.params.id)
    logger.info(results.category)
    logger.info(req.body.value)
    if (!matchRegex(req.body.value, results.category!)) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, "Bad value. Try again."));
    }
    const data = setUpdateData(req, results);
    logger.info(`${req.method} ${req.originalUrl}, updating device`);
    database.query(QUERY.UPDATE_DEVICE, [...Object.values(data), req.params.id], () => {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Device updated`, { id: req.params.id, ...req.body }));
    });
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room_id by id ${req.body.room_id} was not found or Device by id ${req.params.id} was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting Device`);
  try {
    await processData(QUERY.SELECT_DEVICE, req.params.id);
    database.query(QUERY.DELETE_DEVICE, req.params.id, () => {
      return res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Device deleted`));
    });

  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
