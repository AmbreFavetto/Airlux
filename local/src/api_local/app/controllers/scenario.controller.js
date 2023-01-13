import database from '../config/db.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; 

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

export const getScenarios = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenarios`);
  var scenarios= await getResults();
  if(scenarios == -1) {
    res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No scenarios found`));
  } else {
    res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenarios retrieved`, {scenarios}))
  }
};

async function getResults() {
  const keys = await database.keys('scenarios:*')
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

export const createScenario = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating scenarios`);
  database.hset("scenarios:" + Date.now(),req.body, (error, results) => {
    if (!results) {
      logger.error(error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    } else {
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario created`, { results }));
    }
  });
};

export const getScenario = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  const result = await database.hgetall(req.params.id);
  if (Object.keys(result).length == 0 || !req.params.id.startsWith("scenarios:")) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
  } else {
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario retrieved`, { [req.params.id]: result }));
  }
};

export const updateScenario = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching scenario`);
  const result = await database.hgetall(req.params.id);
  if (Object.keys(result).length == 0 || !req.params.id.startsWith("scenarios:")) {
    res.status(HttpStatus.NOT_FOUND.code)
      .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
  } else {
    database.hset(req.params.id, req.body, function (error, results) {
      if(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      } else {
        res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Scenario updated`, { results }));
      }
    });
  }
};

export const deleteScenario = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting scenario`);
  if(req.params.id.startsWith("scenarios:")) {
    database.del(req.params.id, (error, results) => {
      if (results > 0) {
        res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Scenario deleted`, results[0]));
      }
    });
  } else {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Scenario by id ${req.params.id} was not found`));
  }
};

export default HttpStatus;
