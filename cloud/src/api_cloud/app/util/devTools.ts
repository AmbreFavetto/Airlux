import database from '../config/db.config';

const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
  };

async function processDatas(query:string): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
        database.query(query, (error: any, results: any[]) => {
        if (error)
            return reject(error);
        resolve(results);
        }); 
    });
}

async function processData(query:string, id:string): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
        database.query(query, id, (error: any, results: any[]) => {
        if (error)
            return reject(error);
        resolve(results);
        }); 
    });
}

export default HttpStatus;
export {processDatas, processData};