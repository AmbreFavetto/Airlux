import ResponseFormat from '../domain/responseFormat';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from '../util/devTools';
import axios from 'axios';

const regex = /"message":"(POST|PUT|DELETE) ([^"]+) ({.*?})"/g;
const routePfx = 'http://api_cloud:3010';

export const syncLog = async (req: Request, res: Response) => {
  try {
    if (!req.body.file) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, `No file uploaded`));
    }
    const matches = [...req.body.file.matchAll(regex)];
    matches.forEach(async (match) => {
      const method = match[1];
      const route = routePfx + match[2];
      let body = match[3].replaceAll("\\", "");

      if (method === "POST") {
        await axios.post(route, JSON.parse(body));
      } else if (method === "PUT") {
        await axios.put(route, JSON.parse(body));
      } else if (method === "DELETE") {
        await axios.delete(route, JSON.parse(body));
      }
    })

    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `File processed successfully`));
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `File processing failed`));
  }
};