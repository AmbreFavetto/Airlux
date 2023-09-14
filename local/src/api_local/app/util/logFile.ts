import winston from '../config/winston.config';

export function addLog(requestMethod: string, route: string, requestBody: string) {
    winston.log('info', `${requestMethod} ${route} ${requestBody}`);
}