import dbLocal from '../config/db_local.config';
import dbCloud from '../config/db_cloud.config';
import Response from '../domain/response.js';
import logger from '../util/logger.js'; 
import buildingCreateSchema, {buildingUpdateSchema} from '../models/building.model.js';
import {v4 as uuidv4} from 'uuid';
import { deleteFloor } from './floor.controller.js';
import { updateUser } from './user.controller.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

function setData(req) {
  const data = {
    name: req.body.name,
  };
  return data;
}

export const createBuilding = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating building`);
  const { error } = buildingCreateSchema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  } else {
      const key = `buildings:${uuidv4()}`; 
      var data = setData(req);
      try {
        const result = await dbLocal.hmset(key, data);
        res.status(HttpStatus.CREATED.code)
          .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Building created`, { result }));
      } catch (err) {
        logger.error(err.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      }
    }
  };

export const getBuildings = async (req, res) =>  {
  logger.info(`${req.method} ${req.originalUrl}, fetching buildings`); 
  try {
    const keys = await dbLocal.keys('buildings:*');
    let buildings = await Promise.all(keys.map(async key => {
      const data = await dbLocal.hgetall(key);
      return { [key]: data };
    }));
    res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Buildings retrieved`, { buildings }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error));
  }
};

export const getBuilding = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching building`);
  if (!(await dbLocal.exists(`buildings:${req.params.id}`))) {
    // building_id provided does not exist
    res.status(HttpStatus.BAD_REQUEST.code)
    .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'building_id provided does not exist'));
  } else {
    try {
      const result = await dbLocal.hgetall(`buildings:${req.params.id}`);
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Building retrieved`, { [`buildings:${req.params.id}`]: result }));
    } catch(error) {
      res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Building by id buildings:${req.params.id} was not found`));
    }
  }    
};

export const updateBuilding = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching building`);
  const { error } = buildingUpdateSchema.validate(req.body);  
  if(error) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }else {
    if (!(await dbLocal.exists(`buildings:${req.params.id}`))) {
    res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'building_id provided does not exist'));
    } else {
      try{
        await dbLocal.hmset(`buildings:${req.params.id}`, req.body);
        res.status(HttpStatus.CREATED.code)
            .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Building updated`));
      } catch(error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
              .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      } 
    }
  }  
};

let hasError = false;

export const deleteBuilding = async(req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting building`);

  try{
    const buildingExists = await dbLocal.exists(`buildings:${req.params.id}`)
    if (!(buildingExists)) {
      return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'building_id provided does not exist'));
    } 
    const floorsIds = await dbLocal.keys(`floors:*`);
    const floorsToDelete = [];
    await Promise.all(floorsIds.map(async id => {
      const floorData = await dbLocal.hgetall(id);
      if (floorData.building_id === req.params.id.toString()) {
        floorsToDelete.push(id);
      }
    }));
    if(floorsToDelete.length > 0) {
      await Promise.all(floorsToDelete.map(async id => {
        id = id.split(":")[1];
        const floorRes = await deleteFloor({ params: { id: id }, method: "DELETE", originalUrl: `/floor/${id}` });
        if (floorRes.statusCode !== HttpStatus.OK.code) {
          hasError = true;
          return;
        }
      }));      
    }
    let usersIds = await dbLocal.keys('users:*');
    await Promise.all(usersIds.map(async id => {
      const userData = await dbLocal.hgetall(id);
      let userDataUpdate = userData.building_id.split(",");
      if(userDataUpdate.indexOf(req.params.id) != -1) {
        userDataUpdate.splice(userDataUpdate.indexOf(req.params.id), 1);
        id = id.split(":")[1];
        const userRes = await updateUser({params: {id: id}, body: {building_id: userDataUpdate}, method: "UPDATE", originalUrl: `/user/${id}`})
        if (userRes.statusCode !== HttpStatus.OK.code) {
          hasError = true;
          return;
        }
      }
    }));   
    if(!hasError) {
      await dbLocal.del(`buildings:${req.params.id}`);
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Building deleted`));
    }   
  } catch(error){
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
