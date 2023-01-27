import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; // ?????????
import QUERY from '../query/scenario_device.query.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

export const getScenariosDevices = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarios_devices`);
  database.query(QUERY.SELECT_SCENARIOS_DEVICES, (error, results) => {
    if (!results) {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No scenario_device found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `ScenariosDevices retrieved`, { scenarios_devices: results }));
    }
  });
};

export const createScenarioDevice = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating scenario_device`);
  database.query(QUERY.CREATE_SCENARIO_DEVICE_PROCEDURE, Object.values(req.body), (error, results) => {
    if (!results) {
      logger.error(error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    } else {
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `ScenarioDevice created`));
    }
  });
};

export const getScenarioDevice = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario_device`);
  database.query(QUERY.SELECT_SCENARIO_DEVICE, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `ScenarioDevice by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `ScenarioDevice retrieved`, results[0]));
    }
  });
};

export const updateScenarioDevice = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario_device`);
  database.query(QUERY.SELECT_SCENARIO_DEVICE, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `ScenarioDevice by id ${req.params.id} was not found`));
    } else {
      logger.info(`${req.method} ${req.originalUrl}, updating scenario_device`);
      database.query(QUERY.UPDATE_SCENARIO_DEVICE, [...Object.values(req.body), req.params.id], (error, results) => {
        if (!error) {
          res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `ScenarioDevice updated`, { id: req.params.id, ...req.body }));
        } else {
          logger.error(error.message);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
        }
      });
    }
  });
};

export const deleteScenarioDevice = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting ScenarioDevice`);
  database.query(QUERY.DELETE_SCENARIO_DEVICE, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `ScenarioDevice deleted`, results[0]));
    } else {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `ScenarioDevice by id ${req.params.id} was not found`));
    }
  });
};

export default HttpStatus;
