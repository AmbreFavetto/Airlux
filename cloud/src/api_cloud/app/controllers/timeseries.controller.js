import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; // ?????????
import QUERY from '../query/timeseries.query.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

export const getTimeseriess = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching timeseriess`);
  database.query(QUERY.SELECT_TIMESERIESS, (error, results) => {
    console.log("VHO2")
    console.log(results)
    console.log(error)
    if (!results) {
      console.log("VHO2")
      console.log(results)
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No timeseriess found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseriess retrieved`, { timeseriess: results }));
    }
  });
};

export const createTimeseries = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating timeseries`);
  database.query(QUERY.CREATE_TIMESERIES_PROCEDURE, Object.values(req.body), (error, results) => {
    if (!results) {
      logger.error(error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    } else {
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Timeseries created`));
    }
  });
};

export const getTimeseries = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching timeseries`);
  database.query(QUERY.SELECT_TIMESERIES, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Timeseries by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseries retrieved`, results[0]));
    }
  });
};

export const updateTimeseries = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching timeseries`);
  database.query(QUERY.SELECT_TIMESERIES, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Timeseries by id ${req.params.id} was not found`));
    } else {
      logger.info(`${req.method} ${req.originalUrl}, updating timeseries`);
      database.query(QUERY.UPDATE_TIMESERIES, [...Object.values(req.body), req.params.id], (error, results) => {
        if (!error) {
          res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseries updated`, { id: req.params.id, ...req.body }));
        } else {
          logger.error(error.message);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
        }
      });
    }
  });
};

export const deleteTimeseries = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting timeseries`);
  database.query(QUERY.DELETE_TIMESERIES, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Timeseries deleted`, results[0]));
    } else {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Timeseries by id ${req.params.id} was not found`));
    }
  });
};

export default HttpStatus;
