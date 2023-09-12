import axios from 'axios';
import ResponseFormat from '../domain/responseFormat';
import { Request, Response, NextFunction } from 'express';

export const testAxios = (req: Request, res: Response, next: NextFunction) => {
    axios.post('http://localhost:3010/floor', {
        "name": "test",
        "building_id": "legigaiddetest"
    }).then((response: any) => {
        console.log(response.data);
        next();
    }).catch((error: any) => {
        console.log(error);
        return res.status(500).send(new ResponseFormat(500, "Internal Server Error", "error"))
    });
};
