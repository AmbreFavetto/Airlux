import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; 
import QUERY from '../query/building.query.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

export const getBuildings = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching buildings`);
  database.query(QUERY.SELECT_BUILDINGS, (error, results) => {
    console.log(error)
    if (!results) {
      console.log(results)
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No buildings found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Buildings retrieved`, { buildings: results }));
    }
  });
};

export const createBuilding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating building`);
  logger.info(req.body);
  logger.info(Object.values(req.body));
  database.query(QUERY.CREATE_BUILDING_PROCEDURE, Object.values(req.body), (error, results) => {
    logger.info(results);
    if (!results) {
      logger.info(error.message);
      logger.error(error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    } else {
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Building created`));
    }
  });
};

export const getBuilding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching building`);
  database.query(QUERY.SELECT_BUILDING, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Building retrieved`, results[0]));
    }
  });
};

export const updateBuilding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching building`);
  database.query(QUERY.SELECT_BUILDING, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.params.id} was not found`));
    } else {
      logger.info(`${req.method} ${req.originalUrl}, updating building`);
      database.query(QUERY.UPDATE_BUILDING, [...Object.values(req.body), req.params.id], (error, results) => {
        if (!error) {
          res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Building updated`, { id: req.params.id, ...req.body }));
        } else {
          logger.error(error.message);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
        }
      });
    }
  });
};

export const deleteBuilding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting building`);
  database.query(QUERY.DELETE_BUILDING, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Building deleted`, results[0]));
    } else {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id ${req.params.id} was not found`));
    }
  });
};

export default HttpStatus;
