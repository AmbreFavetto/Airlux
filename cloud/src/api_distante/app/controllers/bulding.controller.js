import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; // ?????????
import QUERY from '../query/bulding.query.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

export const getBuldings = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching buldings`);
  database.query(QUERY.SELECT_BULDINGS, (error, results) => {
    if (!results) {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No buldings found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Buldings retrieved`, { buldings: results }));
    }
  });
};

export const createBulding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating bulding`);
  database.query(QUERY.CREATE_BULDING_PROCEDURE, Object.values(req.body), (error, results) => {
    if (!results) {
      logger.error(error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    } else {
      //const patient = { id: results.insertedId, ...req.body, created_at: new Date() };
      const bulding = results[0][0];
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Bulding created`, { bulding }));
    }
  });
};

export const getBulding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching bulding`);
  database.query(QUERY.SELECT_BULDING, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Bulding by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Bulding retrieved`, results[0]));
    }
  });
};

export const updateBulding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching bulding`);
  database.query(QUERY.SELECT_BULDING, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Bulding by id ${req.params.id} was not found`));
    } else {
      logger.info(`${req.method} ${req.originalUrl}, updating bulding`);
      database.query(QUERY.UPDATE_BULDING, [...Object.values(req.body), req.params.id], (error, results) => {
        if (!error) {
          res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Bulding updated`, { id: req.params.id, ...req.body }));
        } else {
          logger.error(error.message);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
        }
      });
    }
  });
};

export const deleteBulding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting bulding`);
  database.query(QUERY.DELETE_BULDING, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Bulding deleted`, results[0]));
    } else {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Bulding by id ${req.params.id} was not found`));
    }
  });
};

export default HttpStatus;
