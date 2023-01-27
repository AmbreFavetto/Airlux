import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; // ?????????
import QUERY from '../query/scenario.query.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

export const getScenarios = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarios`);
  database.query(QUERY.SELECT_SCENARIOS, (error, results) => {
    if (!results) {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No scenario found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenarios retrieved`, { scenarios: results }));
    }
  });
};

export const createScenario = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating scenario`);
  database.query(QUERY.CREATE_SCENARIO_PROCEDURE, Object.values(req.body), (error, results) => {
    if (!results) {
      logger.error(error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    } else {
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario created`));
    }
  });
};

export const getScenario = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  database.query(QUERY.SELECT_SCENARIO, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario retrieved`, results[0]));
    }
  });
};

export const updateScenario = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  database.query(QUERY.SELECT_SCENARIO, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
    } else {
      logger.info(`${req.method} ${req.originalUrl}, updating scenario`);
      database.query(QUERY.UPDATE_SCENARIO, [...Object.values(req.body), req.params.id], (error, results) => {
        if (!error) {
          res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario updated`, { id: req.params.id, ...req.body }));
        } else {
          logger.error(error.message);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
        }
      });
    }
  });
};

export const deleteScenario = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting Scenario`);
  database.query(QUERY.DELETE_SCENARIO, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario deleted`, results[0]));
    } else {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
    }
  });
};

export default HttpStatus;
