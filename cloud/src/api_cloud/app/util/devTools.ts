import database from '../config/db.config';

const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

async function processDatas<T>(query: string): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
        database.query(query, (error: Error, results: Array<T>) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

async function processData<T>(query: string, id: string): Promise<T> {
    return new Promise((resolve, reject) => {
        database.query(query, id, (error, results: T) => {
            if (error)
                return reject(error);
            resolve(results);
        });
    });
}

export default HttpStatus;
export { processDatas, processData };