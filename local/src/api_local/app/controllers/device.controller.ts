import database from '../config/db_local.config';
import ResponseFormat from '../domain/responseFormat';
import logger from '../util/logger';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import deviceCreateSchema, { deviceUpdateSchema } from '../models/device.model';
import HttpStatus, { getEltToDelete } from '../util/devTools';
import Device from '../interfaces/device.interface';
import { sendToKafka } from '../config/kafka.config';

const listActuator = ["lamp", "lamp_rgb", "blind", "radiator", "air_conditioning"]

function setData(req: Request) {
  const data: Device = {
    name: req.body.name,
    room_id: req.body.room_id,
    type: req.body.type,
    category: req.body.category,
    value: req.body.value

  };
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
    "lamp": "0,0",
    "lamp_rgb": "0,0,255,255,255",
    "blind": "0",
    "radiator": "0",
    "air_conditioning": "0",
    "humidity": "0.0",
    "temperature": "0.0",
    "pressure": "0.0"
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
    const roomIdExist = await database.exists(`rooms:${req.body.room_id}`);
    if (!roomIdExist) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Room by id ${req.body.room_id} was not found`));
    }
    if (!req.body.device_id) {
      req.body.device_id = uuidv4();
    }
    if (listActuator.includes(req.body.category)) {
      req.body.type = "actuator"
    } else {
      req.body.type = "sensor"
    }
    req.body.value = setDefaultValue(req.body.category)
    var data = setData(req);
    await database.hmset(`devices:${req.body.device_id}`, data);
    sendToKafka('sendToMysql', "POST /device/ " + JSON.stringify(req.body))
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Device with id ${req.body.device_id} created`, { id: req.body.device_id }));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getDevices = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching devices`);
  try {
    const keys = await database.keys('devices:*');
    const data = await Promise.all(keys.map(async (key: string) => {
      const devices = await database.hgetall(key);
      const device_id = key.split("devices:")[1];
      return { device_id, ...devices };
    }));
    if (data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No Devices found`));
    }
    res.status(HttpStatus.OK.code).send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Devices retrieved`, { devices: data }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching device`);
  if (!(await database.exists(`devices:${req.params.id}`))) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
    return;
  }
  try {
    const devices = await database.hgetall(`devices:${req.params.id}`);
    devices.device_id = req.params.id;
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Device retrieved`, { devices }));
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, updating device`);
  const { error } = deviceUpdateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    return;
  }
  // TODO ADD MATCH REGEX 
  try {
    if (!(await database.exists(`devices:${req.params.id}`))) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
      return;
    }
    await database.hmset(`devices:${req.params.id}`, req.body);
    sendToKafka('sendToMysql', `PUT /device/${req.params.id} ` + JSON.stringify(req.body))
    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Device updated`, { id: req.params.id, ...req.body }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting Device`);
  try {
    const deviceExists = await database.exists(`devices:${req.params.id}`)
    if (!deviceExists) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, 'device_id provided does not exist'));
    }
    await getEltToDelete("sousscenarios", "devices:" + req.params.id);
    sendToKafka('sendToMysql', `DELETE /device/${req.params.id} `)
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Device deleted`));
  } catch (err) {
    if ((err as Error).message === "not_found") {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `id was not found`));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
