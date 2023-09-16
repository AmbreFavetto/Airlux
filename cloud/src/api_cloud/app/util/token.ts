import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ResponseFormat from '../domain/responseFormat';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401)
            .send(new ResponseFormat(401, "Unauthorized", "Unauthorized"));
    }
    const secretKey = process.env.SECRET_KEY || "secret_key"

    jwt.verify(token, secretKey, (err: any) => {
        if (err) {
            return res.status(401)
                .send(new ResponseFormat(401, "Forbidden", "Invalid token"))
        } else {
            return next();
        }
    });

};