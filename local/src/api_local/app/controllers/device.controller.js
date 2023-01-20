import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import device from '../models/device.model.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

export const getDevices = async (req, res) => {
  var devices= await getResults();
  if(devices == -1) {
    res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No Devices found`));
  } else {
    res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Devices retrieved`, {devices}))
  }
};

async function getResults() {
  const keys = await database.keys('devices:*')
  const promises = keys.map(async (key) => {
    const result = await database.hgetall(key);
    if (!result) {
      return -1;
    } else {
      return { [key]: result };
    }
  });
  return Object.assign({}, ...await Promise.all(promises));
}

export const createDevice = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating device`);
  
  const validationResult = device.validate(req.body, device.userSchema);
  if (validationResult.error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, validationResult.error.message));
  } else {
    const rooms_keys = await database.keys('rooms:*')
    if(rooms_keys.includes(req.body.room_id)) {
      database.hset("devices:" + Date.now(),req.body, (error, results) => {
        if (!results) {
          logger.error(error.message);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
        } else {
          res.status(HttpStatus.CREATED.code)
            .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Device created`, { results }));
        }
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST.code)
        .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'room_id provided does not exist'));
    }   
  }
  
};

export const getDevice = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching device`);
  const result = await database.hgetall(req.params.id);
  if (Object.keys(result).length == 0 || !req.params.id.startsWith("devices:")) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
  } else {
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Device retrieved`, { [req.params.id]: result }));
  }
};

export const updateDevice = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching device`);
  const result = await database.hgetall(req.params.id);
  if (Object.keys(result).length == 0 || !req.params.id.startsWith("devices:")) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
  } else {
    database.hset(req.params.id, req.body, function (error, results) {
      if(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      } else {
        res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Device updated`, { results }));
      }
    });
  }
};

export const deleteDevice = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting Device`);
  if(req.params.id.startsWith("devices:")) {
    database.del(req.params.id, (error, results) => {
      if (results > 0) {
        res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Device deleted`, results[0]));
      }
    });
  } else {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Device by id ${req.params.id} was not found`));
  }
};

export default HttpStatus;
