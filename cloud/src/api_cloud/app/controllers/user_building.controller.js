import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; 
import QUERY from '../query/user_building.query.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

export const getUsersBuildings = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching users_buildings`);
  database.query(QUERY.SELECT_USERS_BUILDINGS, (error, results) => {
    console.log(error)
    if (!results) {
      console.log(results)
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No users_buildings found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `UsersBuildings retrieved`, { users_buildings: results }));
    }
  });
};

export const createUserBuilding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating user_building`);
  logger.info(req.body);
  logger.info(Object.values(req.body));
  database.query(QUERY.CREATE_USER_BUILDING_PROCEDURE, Object.values(req.body), (error, results) => {
    logger.info(results);
    if (!results) {
      logger.info(error.message);
      logger.error(error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    } else {
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `UserBuilding created`));
    }
  });
};

export const getUserBuilding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user_building`);
  database.query(QUERY.SELECT_USER_BUILDING, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `UserBuilding by id ${req.params.id} was not found`));
    } else {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `UserBuilding retrieved`, results[0]));
    }
  });
};

export const updateUserBuilding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user_building`);
  database.query(QUERY.SELECT_USER_BUILDING, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `UserBuilding by id ${req.params.id} was not found`));
    } else {
      logger.info(`${req.method} ${req.originalUrl}, updating user_building`);
      database.query(QUERY.UPDATE_USER_BUILDING, [...Object.values(req.body), req.params.id], (error, results) => {
        if (!error) {
          res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `UserBuilding updated`, { id: req.params.id, ...req.body }));
        } else {
          logger.error(error.message);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
        }
      });
    }
  });
};

export const deleteUserBuilding = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting user_building`);
  database.query(QUERY.DELETE_USER_BUILDING, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `UserBuilding deleted`, results[0]));
    } else {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `UserBuilding by id ${req.params.id} was not found`));
    }
  });
};

export default HttpStatus;
